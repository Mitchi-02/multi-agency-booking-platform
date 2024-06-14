import { Injectable } from "@nestjs/common"
import { Kafka } from "kafkajs"
import { BaseHikeEvent } from "./core/hikes/events"
import {
  HikeBookingEventType,
  HikePaymentEventType,
  HikeReviewEventType,
  HikeAgencyEventType,
  HikeEventType,
  UserEventType
} from "./core/base/types"
import { UserTopicPayload } from "./core/users/payload"
import { BaseUserEvent } from "./core/users/events"
import { BaseEvent } from "./core/base/BaseEvent"
import { HikeTopicPayload } from "./core/hikes/payload"
import { BaseHikeAgencyEvent } from "./core/hike-agencies/events"
import { InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose"
import { Hike } from "src/schemas/Hike.schema"
import { HikeBooking } from "src/schemas/HikeBooking.schema"
import { HikeReview } from "src/schemas/HikeReview.schema"
import { HikeAgencyTopicPayload } from "./core/hike-agencies/payload"
import { BaseHikeBookingEvent } from "./core/hike-bookings/events"
import { HikeBookingTopicPayload } from "./core/hike-bookings/payload"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { BaseHikePaymentEvent } from "./core/hike-payments/events"
import { HikePaymentTopicPayload } from "./core/hike-payments/payload"
import { BaseHikeReviewEvent } from "./core/hike-reviews/events"
import { HikeReviewTopicPayload } from "./core/hike-reviews/payload"
import { HikeAgency } from "src/schemas/HikeAgency.schema"

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    clientId: "ms-hikes",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
  })

  private USERS_TOPIC: string = process.env.USERS_TOPIC
  private HIKES_TOPIC: string = process.env.HIKES_TOPIC
  private HIKE_AGENCIES_TOPIC: string = process.env.HIKE_AGENCIES_TOPIC
  private HIKE_BOOKINGS_TOPIC: string = process.env.HIKE_BOOKINGS_TOPIC
  private HIKE_PAYMENTS_TOPIC: string = process.env.HIKE_PAYMENTS_TOPIC
  private HIKE_REVIEWS_TOPIC: string = process.env.HIKE_REVIEWS_TOPIC

  private producer = this.kafka.producer()

  private consumer = this.kafka.consumer({ groupId: "ms-hikes" })

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
    @InjectModel(Hike.name) private hikeModel: Model<Hike>,
    @InjectModel(HikeBooking.name) private hikeBookingModel: Model<HikeBooking>,
    @InjectModel(HikeReview.name) private hikeReviewModel: Model<HikeReview>,
    @InjectModel(HikeAgency.name) private hikeAgencyModel: Model<HikeAgency>,
    private readonly queryCacheService: QueryCacheService
  ) {}

  sendHikeEvent(event: BaseHikeEvent) {
    this.producer.send({
      topic: this.HIKES_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendHikeAgencyEvent(event: BaseHikeAgencyEvent) {
    this.producer.send({
      topic: this.HIKE_AGENCIES_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendHikeBookingEvent(event: BaseHikeBookingEvent) {
    this.producer.send({
      topic: this.HIKE_BOOKINGS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendHikeReviewEvent(event: BaseHikeReviewEvent) {
    this.producer.send({
      topic: this.HIKE_REVIEWS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  private async subscribe() {
    await this.consumer.connect()
    await this.consumer.subscribe({
      topics: [
        this.HIKE_AGENCIES_TOPIC,
        this.HIKES_TOPIC,
        this.USERS_TOPIC,
        this.HIKE_BOOKINGS_TOPIC,
        this.HIKE_PAYMENTS_TOPIC,
        this.HIKE_REVIEWS_TOPIC
      ],
      fromBeginning: true
    })

    this.consumer.run({
      eachMessage: async ({ topic, partition: _, message }) => {
        let event: BaseEvent<any, any>
        switch (topic) {
          case this.HIKE_AGENCIES_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseHikeAgencyEvent
            switch (event.type) {
              case HikeAgencyEventType.DELETE:
                this.handleHikeAgencyDeleted(event.data)
                break
            }
            break
          case this.HIKES_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseHikeEvent
            switch (event.type) {
              case HikeEventType.DELETE:
                this.handleHikeDeleted(event.data)
                break
            }
            break
          case this.HIKE_BOOKINGS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseHikeBookingEvent
            switch (event.type) {
              case HikeBookingEventType.DELETE:
                this.handleBookingDeleted(event.data)
                break
              case HikeBookingEventType.UPDATE:
                this.handleBookingUpdated(event.data)
                break
              case HikeBookingEventType.CREATE:
                this.handleBookingCreated(event.data)
                break
            }
            break
          case this.HIKE_PAYMENTS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseHikePaymentEvent
            switch (event.type) {
              case HikePaymentEventType.UPDATE:
                this.handlePaymentUpdated(event.data)
                break
            }
            break
          case this.HIKE_REVIEWS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseHikeReviewEvent
            switch (event.type) {
              case HikeReviewEventType.CREATE:
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

  private async handleHikeAgencyDeleted(data: HikeAgencyTopicPayload) {
    console.log(`Hike agency deleted: ${data.id}`)
    await Promise.all([
      this.hikeModel.deleteMany({ hike_agency: data.id }),
      this.hikeBookingModel.deleteMany({ hike_agency: data.id }),
      this.hikeReviewModel.deleteMany({ agency: data.id })
    ])
  }

  private async handleHikeDeleted(data: HikeTopicPayload) {
    console.log(`Hike deleted: ${data.id}`)
    await Promise.all([
      this.hikeBookingModel.deleteMany({ hike: data.id }),
      this.hikeReviewModel.deleteMany({ hike: data.id })
    ])
  }

  private async handleUserDeleted(data: UserTopicPayload) {
    console.log(`User deleted: ${data.id}`)
    await Promise.all([
      this.hikeBookingModel.deleteMany({ user_id: data.id }),
      this.hikeReviewModel.deleteMany({ user_id: data.id })
    ])
  }

  private async handleBookingDeleted(data: HikeBookingTopicPayload) {
    console.log(`Booking deleted: ${data.id}`)
    await Promise.all([
      this.queryCacheService.invalidate({
        couples: [
          { key: "BOOKING", all: true },
          { key: "BOOKINGS", all: true },
          { key: "BOOKINGS_COUNT", all: true },
          { key: "HIKE_CLIENT", value: data.hike_id },
          { key: "HIKE_BY_AGENCY", all: true },
          { key: "HIKES_CLIENT", all: true },
          { key: "HIKES_SUGGEST", all: true },
          { key: "HIKES_BY_AGENCY", all: true },
          { key: "HIKES_COUNT_BY_AGENCY", all: true }
        ],
        promise: this.hikeModel.findByIdAndUpdate(data.hike_id, {
          places_left: data.hike_places_left
        })
      }),
      this.hikeReviewModel.deleteOne({ booking: data.id })
    ])
  }

  private async handleBookingUpdated(data: HikeBookingTopicPayload) {
    console.log(`Booking updated: ${data.id}`)
    await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true },
        { key: "HIKE_CLIENT", value: data.hike_id },
        { key: "HIKE_BY_AGENCY", all: true },
        { key: "HIKES_CLIENT", all: true },
        { key: "HIKES_SUGGEST", all: true },
        { key: "HIKES_BY_AGENCY", all: true },
        { key: "HIKES_COUNT_BY_AGENCY", all: true }
      ],
      promise: this.hikeModel.updateOne({ _id: data.hike_id }, { places_left: data.hike_places_left })
    })
  }

  private async handleBookingCreated(data: HikeBookingTopicPayload) {
    console.log(`Booking created: ${data.id}`)
    if (data.hike_places_left === undefined) return
    await this.queryCacheService.invalidate({
      couples: [
        { key: "HIKE_CLIENT", value: data.hike_id },
        { key: "HIKE_BY_AGENCY", value: `${data.hike_id}_${data.agency_id}` },
        { key: "HIKES_CLIENT", all: true },
        { key: "HIKES_SUGGEST", all: true },
        { key: "HIKES_BY_AGENCY", all: true },
        { key: "HIKES_COUNT_BY_AGENCY", all: true }
      ],
      promise: this.hikeModel.updateOne({ _id: data.hike_id }, { places_left: data.hike_places_left })
    })
  }

  private async handlePaymentUpdated(data: HikePaymentTopicPayload) {
    console.log(`Payment updated: ${data.booking_id}`)
    const temp = {}
    if (data.method) temp["method"] = data.method
    if (data.paid) temp["paid"] = data.paid
    await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.hikeBookingModel.findByIdAndUpdate({ _id: data.booking_id }, temp)
    })
  }

  private async handleReviewCreated(data: HikeReviewTopicPayload) {
    console.log(`Review created: ${data.id}`)
    if (data.reviews_count !== undefined) return
    const aggregateResult = await this.hikeReviewModel.aggregate([
      { $match: { agency: new mongoose.Types.ObjectId(data.agency_id) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ])
    const averageRating = aggregateResult.length > 0 ? aggregateResult[0].averageRating : 5
    await this.queryCacheService.invalidate({
      promise: this.hikeAgencyModel.findByIdAndUpdate(
        data.agency_id,
        { rating: averageRating.toFixed(1) },
        { new: true }
      ),
      couples: [
        { key: "AGENCIES", all: true },
        { key: "AGENCY", all: true },
        { key: "AGENCY_COMPLETE", all: true },
        { key: "HIKES_SUGGEST", all: true },
        { key: "HIKE_CLIENT", all: true },
        { key: "HIKE_BY_AGENCY", all: true },
        { key: "HIKES_CLIENT", all: true },
        { key: "HIKES_BY_AGENCY", all: true }
      ]
    })
  }
}
