import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BookingStatus, HikeBooking } from "src/schemas/HikeBooking.schema"
import { BookerDto, CreateHikeBookingDto } from "./dto/create-booking.dto"
import { Hike } from "src/schemas/Hike.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { UpdateHikeBookingDto } from "./dto/update-booking.dto"
import { Injectable } from "@nestjs/common"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import {
  HikeBookingCreatedEvent,
  HikeBookingDeletedEvent,
  HikeBookingUpdatedEvent
} from "src/kafka/core/hike-bookings/events"

@Injectable()
export class HikeBookingService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1

  constructor(
    @InjectModel(HikeBooking.name) private hikeBookingModel: Model<HikeBooking>,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(user_id: number, data: CreateHikeBookingDto, hike: Hike) {
    let totalPrice = 0
    const items = data.bookers.map((booker) => {
      const { services, price } = this.calculatePrice(booker, hike)
      totalPrice += price
      return { ...booker, chosen_services: services ?? [], price, status: BookingStatus.PENDING }
    })
    const b = await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKINGS", all: true },
        { key: "BOOKINGS_COUNT", all: true }
      ],
      promise: this.hikeBookingModel.create({
        hike: hike._id,
        user_id: user_id,
        price: totalPrice,
        hike_agency: hike.hike_agency,
        booking_items: items
      })
    })
    this.kafkaService.sendHikeBookingEvent(
      new HikeBookingCreatedEvent({
        id: b._id,
        hike_id: hike._id,
        user_id,
        price: b.price,
        agency_id: hike.hike_agency._id,
        hike_places_left: hike.places_left - data.bookers.length,
        hike_agency_name: hike.hike_agency.name,
        hike_destination: hike.destination,
        hike_departure_date: hike.departure_date,
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
      hike_id?: string
      agency_id?: string
      user_id?: number
    }
  ) {
    const paramsQuery = {}
    if (params.hike_id) paramsQuery["hike"] = params.hike_id
    if (params.agency_id) paramsQuery["hike_agency"] = params.agency_id
    if (params.user_id) paramsQuery["user_id"] = params.user_id
    let { page, page_size } = query
    page = (+page || HikeBookingService.DEFAULT_PAGE) - 1
    page_size = +page_size || HikeBookingService.DEFAULT_PAGE_SIZE
    const [count, results] = await Promise.all([
      this.queryCacheService.get<number>({
        key: "BOOKINGS_COUNT",
        value: `${JSON.stringify(paramsQuery)}`,
        promise: this.hikeBookingModel.countDocuments(paramsQuery)
      }),
      this.queryCacheService.get<HikeBooking[]>({
        key: "BOOKINGS",
        value: `${page}_${page_size}_${JSON.stringify(paramsQuery)}`,
        promise: this.hikeBookingModel
          .find(paramsQuery)
          .populate([
            { path: "hike", select: "_id destination departure_date" },
            { path: "hike_agency", select: "_id name" }
          ])
          .sort({ createdAt: -1 })
          .limit(page_size)
          .skip(page * page_size)
      })
    ])
    return { count, results, page: page + 1, page_size }
  }

  findOne(params: { booking_id?: string; agency_id?: string; user_id?: number; hike_id?: string }) {
    const query = {}
    if (params.booking_id) query["_id"] = params.booking_id
    if (params.agency_id) query["hike_agency"] = params.agency_id
    if (params.user_id) query["user_id"] = params.user_id
    if (params.hike_id) {
      query["hike"] = params.hike_id
      query["booking_items"] = [{ $all: { status: "PENDING" } }]
    }
    return this.queryCacheService.get<HikeBooking>({
      key: "BOOKING",
      value: JSON.stringify(query),
      promise: this.hikeBookingModel.findOne(query, null, {
        populate: [
          { path: "hike", select: "_id places_left complementary_services destination title adult_price kid_price" },
          { path: "hike_agency", select: "_id" }
        ]
      })
    })
  }

  async update(booking: HikeBooking, data: UpdateHikeBookingDto) {
    let totalPrice = 0
    const items = data.bookers.map((booker) => {
      const { services, price } = this.calculatePrice(booker, booking.hike)
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
      promise: this.hikeBookingModel.findByIdAndUpdate(
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
    this.kafkaService.sendHikeBookingEvent(
      new HikeBookingUpdatedEvent({
        id: b._id,
        hike_id: booking.hike._id,
        user_id: booking.user_id,
        price: b.price,
        agency_id: booking.hike_agency._id,
        hike_places_left: booking.hike.places_left + booking.booking_items.length - data.bookers.length,
        method: b.method,
        paid: b.paid,
        booking_items: b.booking_items
      })
    )
    return b
  }

  async remove(booking: HikeBooking) {
    const res = await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.hikeBookingModel.findByIdAndDelete(booking._id)
    })
    if (res)
      this.kafkaService.sendHikeBookingEvent(
        new HikeBookingDeletedEvent({
          id: booking._id,
          hike_id: booking.hike._id,
          user_id: booking.user_id,
          agency_id: booking.hike_agency._id,
          hike_places_left: booking.hike.places_left + booking.booking_items.length
        })
      )
    return res
  }

  calculatePrice(
    data: BookerDto,
    hike: Hike
  ): {
    services: string[]
    price: number
  } {
    const services = []
    const price = !data.chosen_services
      ? 0
      : data.chosen_services.reduce(
          (acc, service) => {
            const s = hike.complementary_services.find((s) => s.name === service)
            if (s) {
              services.push(s.name)
              return acc + s.price
            }
            return acc
          },
          data.type === "adult" ? hike.adult_price : hike.kid_price
        )
    return { services, price }
  }
}
