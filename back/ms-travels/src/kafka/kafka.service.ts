import { Injectable } from "@nestjs/common"
import { Kafka } from "kafkajs"
import { BaseTravelEvent } from "./core/travels/events"
import {
  TravelBookingEventType,
  TravelPaymentEventType,
  TravelReviewEventType,
  TravelAgencyEventType,
  TravelEventType,
  UserEventType
} from "./core/base/types"
import { UserTopicPayload } from "./core/users/payload"
import { BaseUserEvent } from "./core/users/events"
import { BaseEvent } from "./core/base/BaseEvent"
import { TravelTopicPayload } from "./core/travels/payload"
import { BaseTravelAgencyEvent } from "./core/travel-agencies/events"
import { InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose"
import { Travel } from "src/schemas/Travel.schema"
import { TravelBooking } from "src/schemas/TravelBooking.schema"
import { TravelReview } from "src/schemas/TravelReview.schema"
import { TravelAgencyTopicPayload } from "./core/travel-agencies/payload"
import { BaseTravelBookingEvent } from "./core/travel-bookings/events"
import { TravelBookingTopicPayload } from "./core/travel-bookings/payload"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { BaseTravelPaymentEvent } from "./core/travel-payments/events"
import { TravelPaymentTopicPayload } from "./core/travel-payments/payload"
import { BaseTravelReviewEvent } from "./core/travel-reviews/events"
import { TravelReviewTopicPayload } from "./core/travel-reviews/payload"
import { TravelAgency } from "src/schemas/TravelAgency.schema"

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    clientId: "ms-travels",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
  })

  private USERS_TOPIC: string = process.env.USERS_TOPIC
  private TRAVELS_TOPIC: string = process.env.TRAVELS_TOPIC
  private TRAVEL_AGENCIES_TOPIC: string = process.env.TRAVEL_AGENCIES_TOPIC
  private TRAVEL_BOOKINGS_TOPIC: string = process.env.TRAVEL_BOOKINGS_TOPIC
  private TRAVEL_PAYMENTS_TOPIC: string = process.env.TRAVEL_PAYMENTS_TOPIC
  private TRAVEL_REVIEWS_TOPIC: string = process.env.TRAVEL_REVIEWS_TOPIC

  private producer = this.kafka.producer()

  private consumer = this.kafka.consumer({ groupId: "ms-travels" })

  onModuleInit() {
    this.producer.connect()
    this.consumer.connect()
    this.subscribe()
  }

  onModuleDestroy() {
    this.producer.disconnect()
    this.consumer.disconnect()
  }

  constructor(
    @InjectModel(Travel.name) private travelModel: Model<Travel>,
    @InjectModel(TravelBooking.name) private travelBookingModel: Model<TravelBooking>,
    @InjectModel(TravelReview.name) private travelReviewModel: Model<TravelReview>,
    @InjectModel(TravelAgency.name) private travelAgencyModel: Model<TravelAgency>,
    private readonly queryCacheService: QueryCacheService
  ) {}

  sendTravelEvent(event: BaseTravelEvent) {
    this.producer.send({
      topic: this.TRAVELS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendTravelAgencyEvent(event: BaseTravelAgencyEvent) {
    this.producer.send({
      topic: this.TRAVEL_AGENCIES_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendTravelBookingEvent(event: BaseTravelBookingEvent) {
    console.log("Sending booking event")

    this.producer.send({
      topic: this.TRAVEL_BOOKINGS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendTravelReviewEvent(event: BaseTravelReviewEvent) {
    this.producer.send({
      topic: this.TRAVEL_REVIEWS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  private async subscribe() {
    await this.consumer.connect()
    await this.consumer.subscribe({
      topics: [
        this.TRAVEL_AGENCIES_TOPIC,
        this.TRAVELS_TOPIC,
        this.USERS_TOPIC,
        this.TRAVEL_BOOKINGS_TOPIC,
        this.TRAVEL_PAYMENTS_TOPIC,
        this.TRAVEL_REVIEWS_TOPIC
      ],
      fromBeginning: true
    })

    this.consumer.run({
      eachMessage: async ({ topic, partition: _, message }) => {
        let event: BaseEvent<any, any>
        switch (topic) {
          case this.TRAVEL_AGENCIES_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseTravelAgencyEvent
            switch (event.type) {
              case TravelAgencyEventType.DELETE:
                this.handleTravelAgencyDeleted(event.data)
                break
            }
            break
          case this.TRAVELS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseTravelEvent
            switch (event.type) {
              case TravelEventType.DELETE:
                this.handleTravelDeleted(event.data)
                break
            }
            break
          case this.TRAVEL_BOOKINGS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseTravelBookingEvent
            switch (event.type) {
              case TravelBookingEventType.DELETE:
                this.handleBookingDeleted(event.data)
                break
              case TravelBookingEventType.UPDATE:
                this.handleBookingUpdated(event.data)
                break
              case TravelBookingEventType.CREATE:
                this.handleBookingCreated(event.data)
                break
            }
            break
          case this.TRAVEL_PAYMENTS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseTravelPaymentEvent
            switch (event.type) {
              case TravelPaymentEventType.UPDATE:
                this.handlePaymentUpdated(event.data)
                break
            }
            break
          case this.TRAVEL_REVIEWS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseTravelReviewEvent
            switch (event.type) {
              case TravelReviewEventType.CREATE:
                this.handleReviewCreated(event.data)
                break
            }
            break
          case this.USERS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseUserEvent
            switch (event.type) {
              case UserEventType.DELETE:
                this.handleUserDeleted(event.data)
                break
            }
            break
        }
      }
    })
  }

  private async handleTravelAgencyDeleted(data: TravelAgencyTopicPayload) {
    console.log(`Travel agency deleted: ${data.id}`)
    await Promise.all([
      this.travelModel.deleteMany({ travel_agency: data.id }),
      this.travelBookingModel.deleteMany({ travel_agency: data.id }),
      this.travelReviewModel.deleteMany({ agency: data.id })
    ])
  }

  private async handleTravelDeleted(data: TravelTopicPayload) {
    console.log(`Travel deleted: ${data.id}`)
    await Promise.all([
      this.travelBookingModel.deleteMany({ travel: data.id }),
      this.travelReviewModel.deleteMany({ travel: data.id })
    ])
  }

  private async handleUserDeleted(data: UserTopicPayload) {
    console.log(`User deleted: ${data.id}`)
    await Promise.all([
      this.travelBookingModel.deleteMany({ user_id: data.id }),
      this.travelReviewModel.deleteMany({ user_id: data.id })
    ])
  }

  private async handleBookingDeleted(data: TravelBookingTopicPayload) {
    console.log(`Booking deleted: ${data.id}`)
    await Promise.all([
      this.queryCacheService.invalidate({
        couples: [
          { key: "BOOKING", all: true },
          { key: "BOOKINGS", all: true },
          { key: "BOOKINGS_COUNT", all: true },
          { key: "TRAVEL_CLIENT", value: data.travel_id },
          { key: "TRAVEL_CLIENT", value: data.travel_id },
          { key: "TRAVEL_BY_AGENCY", all: true },
          { key: "TRAVELS_CLIENT", all: true },
          { key: "TRAVELS_SUGGEST", all: true },
          { key: "TRAVELS_BY_AGENCY", all: true },
          { key: "TRAVELS_COUNT_BY_AGENCY", all: true }
        ],
        promise: this.travelModel.findByIdAndUpdate(data.travel_id, {
          places_left: data.travel_places_left
        })
      }),
      this.travelReviewModel.deleteOne({ booking: data.id })
    ])
  }

  private async handleBookingUpdated(data: TravelBookingTopicPayload) {
    console.log(`Booking updated: ${data.id}`)
    await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true },
        { key: "TRAVEL_CLIENT", value: data.travel_id },
        { key: "TRAVEL_BY_AGENCY", all: true },
        { key: "TRAVELS_CLIENT", all: true },
        { key: "TRAVELS_SUGGEST", all: true },
        { key: "TRAVELS_BY_AGENCY", all: true },
        { key: "TRAVELS_COUNT_BY_AGENCY", all: true }
      ],
      promise: this.travelModel.updateOne({ _id: data.travel_id }, { places_left: data.travel_places_left })
    })
  }

  private async handleBookingCreated(data: TravelBookingTopicPayload) {
    console.log(`Booking created: ${data.id}`)
    if (data.travel_places_left === undefined) return
    await this.queryCacheService.invalidate({
      couples: [
        { key: "TRAVEL_CLIENT", value: data.travel_id },
        { key: "TRAVEL_BY_AGENCY", value: `${data.travel_id}_${data.agency_id}` },
        { key: "TRAVELS_CLIENT", all: true },
        { key: "TRAVELS_SUGGEST", all: true },
        { key: "TRAVELS_BY_AGENCY", all: true },
        { key: "TRAVELS_COUNT_BY_AGENCY", all: true }
      ],
      promise: this.travelModel.updateOne({ _id: data.travel_id }, { places_left: data.travel_places_left })
    })
  }

  private async handlePaymentUpdated(data: TravelPaymentTopicPayload) {
    console.log(`Payment updated: ${data.booking_id}`)
    const temp = {}
    if (data.method) temp["method"] = data.method
    if (data.paid) temp["paid"] = data.paid
    await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.travelBookingModel.findByIdAndUpdate({ _id: data.booking_id }, temp)
    })
  }

  private async handleReviewCreated(data: TravelReviewTopicPayload) {
    console.log(`Review created: ${data.id}`)
    if (data.reviews_count !== undefined) return
    const aggregateResult = await this.travelReviewModel.aggregate([
      { $match: { agency: new mongoose.Types.ObjectId(data.agency_id) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ])
    const averageRating = aggregateResult.length > 0 ? aggregateResult[0].averageRating : 5
    await this.queryCacheService.invalidate({
      promise: this.travelAgencyModel.findByIdAndUpdate(
        data.agency_id,
        { rating: averageRating.toFixed(1) },
        { new: true }
      ),
      couples: [
        { key: "AGENCIES", all: true },
        { key: "AGENCY", all: true },
        { key: "AGENCY_COMPLETE", all: true },
        { key: "TRAVELS_SUGGEST", all: true },
        { key: "TRAVEL_CLIENT", all: true },
        { key: "TRAVEL_BY_AGENCY", all: true },
        { key: "TRAVELS_CLIENT", all: true },
        { key: "TRAVELS_BY_AGENCY", all: true }
      ]
    })
  }
}
