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
import { Model } from "mongoose"
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
import { ProxyService } from "src/proxy/proxy.service"

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    clientId: "ms-hikes-query",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
  })

  private USERS_TOPIC: string = process.env.USERS_TOPIC
  private HIKES_TOPIC: string = process.env.HIKES_TOPIC
  private HIKE_AGENCIES_TOPIC: string = process.env.HIKE_AGENCIES_TOPIC
  private HIKE_BOOKINGS_TOPIC: string = process.env.HIKE_BOOKINGS_TOPIC
  private HIKE_PAYMENTS_TOPIC: string = process.env.HIKE_PAYMENTS_TOPIC
  private HIKE_REVIEWS_TOPIC: string = process.env.HIKE_REVIEWS_TOPIC

  private consumer = this.kafka.consumer({ groupId: "ms-hikes-query" })

  onModuleInit() {
    this.consumer.connect()
    this.subscribe()
  }

  onModuleDestroy() {
    this.consumer.disconnect()
  }

  constructor(
    @InjectModel(HikeBooking.name) private hikeBookingModel: Model<HikeBooking>,
    @InjectModel(HikeReview.name) private hikeReviewModel: Model<HikeReview>,
    private readonly queryCacheService: QueryCacheService,
    private readonly proxyService: ProxyService
  ) {}

  private async subscribe() {
    await Promise.all([this.hikeBookingModel.deleteMany({}), this.hikeReviewModel.deleteMany({})])
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
              case UserEventType.UPDATE:
                this.handleUserUpdated(event.data)
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

  private async handleUserUpdated(data: UserTopicPayload) {
    console.log(`User updated: ${data.id}`)
    await Promise.all([
      this.queryCacheService.invalidate({
        couples: [
          {
            key: "BOOKING",
            all: true
          },
          { key: "BOOKINGS", all: true },
          { key: "REVIEWS", all: true },
          { key: "REVIEWS_THREE", all: true }
        ],
        promise: this.hikeBookingModel.updateMany(
          {
            "user.id": data.id
          },
          {
            $set: {
              "user.id": data.id,
              "user.first_name": data.first_name,
              "user.last_name": data.last_name,
              "user.email": data.email,
              "user.phone": data.phone,
              "user.profile_picture": data.profile_picture
            }
          }
        )
      }),
      this.queryCacheService.invalidate({
        couples: [],
        promise: this.hikeReviewModel.updateMany(
          {
            "user.id": data.id
          },
          {
            $set: {
              "user.id": data.id,
              "user.first_name": data.first_name,
              "user.last_name": data.last_name,
              "user.address": data.address,
              "user.profile_picture": data.profile_picture
            }
          }
        )
      })
    ])
  }

  private async handleBookingDeleted(data: HikeBookingTopicPayload) {
    console.log(`Booking deleted: ${data.id}`)
    await Promise.all([
      this.queryCacheService.invalidate({
        couples: [
          {
            key: "BOOKING",
            value: JSON.stringify({
              booking_id: data.id,
              hike_agency: data.agency_id
            })
          },
          { key: "BOOKINGS_COUNT", all: true },
          { key: "BOOKINGS", all: true }
        ],
        promise: this.hikeBookingModel.deleteOne({ _id: data.id })
      }),
      this.queryCacheService.invalidate({
        couples: [
          { key: "REVIEWS", all: true },
          { key: "REVIEWS_COUNT", all: true },
          { key: "REVIEWS_THREE", value: data.agency_id }
        ],
        promise: this.hikeReviewModel.deleteMany({
          booking: data.id
        })
      })
    ])
  }

  private async handleBookingUpdated(data: HikeBookingTopicPayload) {
    console.log(`Booking updated: ${data.id}`)
    await this.queryCacheService.invalidate({
      couples: [
        {
          key: "BOOKING",
          value: JSON.stringify({
            booking_id: data.id,
            hike_agency: data.agency_id
          })
        },
        { key: "BOOKINGS_COUNT", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.hikeBookingModel.findByIdAndUpdate(data.id, {
        $set: {
          price: parseFloat(data.price),
          method: data.method,
          paid: data.paid,
          booking_items: data.booking_items
        }
      })
    })
  }

  private async handleBookingCreated(data: HikeBookingTopicPayload) {
    console.log(`Booking created: ${data.id}`)
    const user = await this.proxyService.getUserById(data.user_id)
    console.log("user", user)
    console.log("data", data)

    if (!user) return
    await this.queryCacheService.invalidate({
      couples: [
        { key: "BOOKINGS_COUNT", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.hikeBookingModel.create({
        _id: data.id,
        hike_agency: {
          _id: data.agency_id,
          name: data.hike_agency_name
        },
        hike: {
          _id: data.hike_id,
          destination: data.hike_destination,
          departure_date: data.hike_departure_date
        },
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          profile_picture: user.profile_picture
        },
        price: parseFloat(data.price),
        method: data.method,
        paid: data.paid,
        booking_items: data.booking_items
      })
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
        { key: "BOOKINGS_COUNT", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.hikeBookingModel.findByIdAndUpdate(data.booking_id, { $set: temp })
    })
  }

  private async handleReviewCreated(data: HikeReviewTopicPayload) {
    console.log(`Review created: ${data.id}`)
    const user = await this.proxyService.getUserById(data.user_id)
    if (!user) return
    const temp = await this.hikeReviewModel.findOne({
      "user.id": data.user_id
    })
    let reviews_count = 0
    if (data.reviews_count !== undefined) reviews_count = data.reviews_count
    else if (temp) {
      reviews_count = temp.user.reviews_count + 1
    }

    await this.queryCacheService.invalidate({
      couples: [
        {
          key: "REVIEWS",
          all: true
        },
        {
          key: "REVIEWS_COUNT",
          all: true
        },
        {
          key: "REVIEWS_THREE",
          value: data.agency_id
        }
      ],
      promise: this.hikeReviewModel.create({
        _id: data.id,
        rating: data.rating,
        booking: data.booking_id,
        agency: data.agency_id,
        hike: data.hike_id,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          address: user.address,
          profile_picture: user.profile_picture,
          reviews_count: reviews_count
        },
        comment: data.comment
      })
    })
    if (!temp || data.reviews_count !== undefined) return

    await this.hikeReviewModel.updateMany(
      {
        "user.id": data.user_id
      },
      {
        $set: {
          "user.id": user.id,
          "user.first_name": user.first_name,
          "user.last_name": user.last_name,
          "user.address": user.address,
          "user.profile_picture": user.profile_picture,
          "user.reviews_count": reviews_count
        }
      }
    )
  }
}
