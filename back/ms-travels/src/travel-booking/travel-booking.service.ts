import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { TravelBooking } from "src/schemas/TravelBooking.schema"
import { BookerDto, CreateTravelBookingDto } from "./dto/create-booking.dto"
import { Travel } from "src/schemas/Travel.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { UpdateTravelBookingDto } from "./dto/update-booking.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import {
  TravelBookingCreatedEvent,
  TravelBookingDeletedEvent,
  TravelBookingUpdatedEvent
} from "src/kafka/core/travel-bookings/events"

@Injectable()
export class TravelBookingService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1

  constructor(
    @InjectModel(TravelBooking.name) private travelBookingModel: Model<TravelBooking>,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(user_id: number, data: CreateTravelBookingDto, travel: Travel) {
    let totalPrice = 0
    const items = data.bookers.map((booker) => {
      const { services, price } = this.calculatePrice(booker, travel)
      totalPrice += price
      return { ...booker, chosen_services: services ?? [], price }
    })
    const b = await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKINGS", all: true },
        { key: "BOOKINGS_COUNT", all: true }
      ],
      promise: this.travelBookingModel.create({
        travel: travel._id,
        user_id: user_id,
        price: totalPrice,
        travel_agency: travel.travel_agency,
        booking_items: items
      })
    })
    this.kafkaService.sendTravelBookingEvent(
      new TravelBookingCreatedEvent({
        id: b._id,
        travel_id: travel._id,
        user_id,
        price: b.price,
        agency_id: travel.travel_agency._id,
        travel_places_left: travel.places_left - data.bookers.length,
        travel_agency_name: travel.travel_agency.name,
        travel_destination: travel.destination,
        travel_departure_date: travel.departure_date,
        method: b.method,
        paid: b.paid,
        booking_items: b.booking_items
      })
    )
    return b
  }

  async findAll(
    query: PaginationQueryDto,
    params: {
      travel_id?: string
      agency_id?: string
      user_id?: number
    }
  ) {
    const paramsQuery = {}
    if (params.travel_id) paramsQuery["travel"] = params.travel_id
    if (params.agency_id) paramsQuery["travel_agency"] = params.agency_id
    if (params.user_id) paramsQuery["user_id"] = params.user_id
    let { page, page_size } = query
    page = (+page || TravelBookingService.DEFAULT_PAGE) - 1
    page_size = +page_size || TravelBookingService.DEFAULT_PAGE_SIZE
    const [count, results] = await Promise.all([
      this.queryCacheService.get<number>({
        key: "BOOKINGS_COUNT",
        value: `${JSON.stringify(paramsQuery)}`,
        promise: this.travelBookingModel.countDocuments(paramsQuery)
      }),
      this.queryCacheService.get<TravelBooking[]>({
        key: "BOOKINGS",
        value: `${page}_${page_size}_${JSON.stringify(paramsQuery)}`,
        promise: this.travelBookingModel
          .find(paramsQuery)
          .populate([
            { path: "travel", select: "_id destination departure_date" },
            { path: "travel_agency", select: "_id name" }
          ])
          .sort({ createdAt: -1 })
          .limit(page_size)
          .skip(page * page_size)
      })
    ])
    return { count, results, page: page + 1, page_size }
  }

  findOne(params: { booking_id?: string; agency_id?: string; user_id?: number; travel_id?: string }) {
    const query = {}
    if (params.booking_id) query["_id"] = params.booking_id
    if (params.agency_id) query["travel_agency"] = params.agency_id
    if (params.user_id) query["user_id"] = params.user_id
    if (params.travel_id) {
      query["travel"] = params.travel_id
      query["booking_items"] = [{ $all: { status: "PENDING" } }]
    }
    return this.queryCacheService.get<TravelBooking>({
      key: "BOOKING",
      value: JSON.stringify(query),
      promise: this.travelBookingModel.findOne(query, null, {
        populate: [
          { path: "travel", select: "_id places_left complementary_services destination title adult_price kid_price" },
          { path: "travel_agency", select: "_id" }
        ]
      })
    })
  }

  async update(booking: TravelBooking, data: UpdateTravelBookingDto) {
    let totalPrice = 0
    const items = data.bookers.map((booker) => {
      const { services, price } = this.calculatePrice(booker, booking.travel)
      totalPrice += price
      return { ...booker, chosen_services: services ?? [], price }
    })
    if (data.method) {
      booking.method = data.method
    }
    if (data.paid) {
      booking.paid = data.paid
    }
    const b = await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.travelBookingModel.findByIdAndUpdate(
        { _id: booking._id },
        {
          booking_items: items,
          price: totalPrice,
          method: booking.method,
          paid: booking.paid
        },
        { new: true }
      )
    })
    this.kafkaService.sendTravelBookingEvent(
      new TravelBookingUpdatedEvent({
        id: b._id,
        travel_id: booking.travel._id,
        user_id: booking.user_id,
        price: b.price,
        agency_id: booking.travel_agency._id,
        travel_places_left: booking.travel.places_left + booking.booking_items.length - data.bookers.length,
        method: b.method,
        paid: b.paid,
        booking_items: b.booking_items
      })
    )
    return b
  }

  async remove(booking: TravelBooking) {
    const res = await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.travelBookingModel.findByIdAndDelete(booking._id)
    })
    if (res)
      this.kafkaService.sendTravelBookingEvent(
        new TravelBookingDeletedEvent({
          id: booking._id,
          travel_id: booking.travel._id,
          agency_id: booking.travel_agency._id,
          user_id: booking.user_id,
          travel_places_left: booking.travel.places_left + booking.booking_items.length
        })
      )
    return res
  }

  calculatePrice(
    data: BookerDto,
    travel: Travel
  ): {
    services: string[]
    price: number
  } {
    const services = []
    const price = !data.chosen_services
      ? 0
      : data.chosen_services.reduce(
          (acc, service) => {
            const s = travel.complementary_services.find((s) => s.name === service)
            if (s) {
              services.push(s.name)
              return acc + s.price
            }
            return acc
          },
          data.type === "adult" ? travel.adult_price : travel.kid_price
        )
    return { services, price }
  }
}
