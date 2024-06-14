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
import { Model } from "mongoose"
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
import { ProxyService } from "src/proxy/proxy.service"

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    clientId: "ms-travels-query",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
  })

  private USERS_TOPIC: string = process.env.USERS_TOPIC
  private TRAVELS_TOPIC: string = process.env.TRAVELS_TOPIC
  private TRAVEL_AGENCIES_TOPIC: string = process.env.TRAVEL_AGENCIES_TOPIC
  private TRAVEL_BOOKINGS_TOPIC: string = process.env.TRAVEL_BOOKINGS_TOPIC
  private TRAVEL_PAYMENTS_TOPIC: string = process.env.TRAVEL_PAYMENTS_TOPIC
  private TRAVEL_REVIEWS_TOPIC: string = process.env.TRAVEL_REVIEWS_TOPIC

  private consumer = this.kafka.consumer({ groupId: "ms-travels-query" })

  onModuleInit() {
    this.consumer.connect()
    this.subscribe()
  }

  onModuleDestroy() {
    this.consumer.disconnect()
  }

  constructor(
    @InjectModel(TravelBooking.name) private travelBookingModel: Model<TravelBooking>,
    @InjectModel(TravelReview.name) private travelReviewModel: Model<TravelReview>,
    private readonly queryCacheService: QueryCacheService,
    private readonly proxyService: ProxyService
  ) {}

  private async subscribe() {
    await Promise.all([this.travelBookingModel.deleteMany({}), this.travelReviewModel.deleteMany({})])
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
              case UserEventType.UPDATE:
                this.handleUserUpdated(event.data)
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
        promise: this.travelBookingModel.updateMany(
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
        promise: this.travelReviewModel.updateMany(
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

  private async handleBookingDeleted(data: TravelBookingTopicPayload) {
    console.log(`Booking deleted: ${data.id}`)
    await Promise.all([
      this.queryCacheService.invalidate({
        couples: [
          {
            key: "BOOKING",
            value: JSON.stringify({
              booking_id: data.id,
              travel_agency: data.agency_id
            })
          },
          { key: "BOOKINGS_COUNT", all: true },
          { key: "BOOKINGS", all: true }
        ],
        promise: this.travelBookingModel.deleteOne({ _id: data.id })
      }),
      this.queryCacheService.invalidate({
        couples: [
          { key: "REVIEWS", all: true },
          { key: "REVIEWS_COUNT", all: true },
          { key: "REVIEWS_THREE", value: data.agency_id }
        ],
        promise: this.travelReviewModel.deleteMany({
          booking: data.id
        })
      })
    ])
  }

  private async handleBookingUpdated(data: TravelBookingTopicPayload) {
    console.log(`Booking updated: ${data.id}`)
    await this.queryCacheService.invalidate({
      couples: [
        {
          key: "BOOKING",
          value: JSON.stringify({
            booking_id: data.id,
            travel_agency: data.agency_id
          })
        },
        { key: "BOOKINGS_COUNT", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.travelBookingModel.findByIdAndUpdate(data.id, {
        $set: {
          price: parseFloat(data.price),
          method: data.method,
          paid: data.paid,
          booking_items: data.booking_items
        }
      })
    })
  }

  private async handleBookingCreated(data: TravelBookingTopicPayload) {
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
      promise: this.travelBookingModel.create({
        _id: data.id,
        travel_agency: {
          _id: data.agency_id,
          name: data.travel_agency_name
        },
        travel: {
          _id: data.travel_id,
          destination: data.travel_destination,
          departure_date: data.travel_departure_date
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

  private async handlePaymentUpdated(data: TravelPaymentTopicPayload) {
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
      promise: this.travelBookingModel.findByIdAndUpdate(data.booking_id, { $set: temp })
    })
  }

  private async handleReviewCreated(data: TravelReviewTopicPayload) {
    console.log(`Review created: ${data.id}`)
    const user = await this.proxyService.getUserById(data.user_id)
    if (!user) return
    const temp = await this.travelReviewModel.findOne({
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
      promise: this.travelReviewModel.create({
        _id: data.id,
        rating: data.rating,
        booking: data.booking_id,
        agency: data.agency_id,
        travel: data.travel_id,
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

    await this.travelReviewModel.updateMany(
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
