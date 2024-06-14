import { Injectable } from "@nestjs/common"
import { Kafka } from "kafkajs"
import { TravelBookingEventType, UserEventType } from "./core/base/types"
import { UserTopicPayload } from "./core/users/payload"
import { BaseUserEvent } from "./core/users/events"
import { BaseEvent } from "./core/base/BaseEvent"
import { BaseTravelBookingEvent } from "./core/travel-bookings/events"
import { TravelBookingTopicPayload } from "./core/travel-bookings/payload"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { BaseTravelPaymentEvent } from "./core/travel-payments/events"
import { InjectRepository } from "@nestjs/typeorm"
import { TravelPayment } from "src/models/travel-payment.entity"
import { HikePayment } from "src/models/hike-payment.entity"
import { Repository } from "typeorm"
import { PaymentMethod } from "src/models"
import { BaseHikeBookingEvent } from "./core/hike-bookings/events"
import { HikeBookingTopicPayload } from "./core/hike-bookings/payload"
import { BaseHikePaymentEvent } from "./core/travel-payments copy/events"

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    clientId: "ms-payment",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
  })

  private USERS_TOPIC: string = process.env.USERS_TOPIC
  private TRAVEL_BOOKINGS_TOPIC: string = process.env.TRAVEL_BOOKINGS_TOPIC
  private TRAVEL_PAYMENTS_TOPIC: string = process.env.TRAVEL_PAYMENTS_TOPIC
  private HIKE_PAYMENTS_TOPIC: string = process.env.HIKE_PAYMENTS_TOPIC
  private HIKE_BOOKINGS_TOPIC: string = process.env.HIKE_BOOKINGS_TOPIC

  private producer = this.kafka.producer()

  private consumer = this.kafka.consumer({ groupId: "ms-payment" })

  async onModuleInit() {
    this.producer.connect()
    this.consumer.connect()
    this.subscribe()
  }

  onModuleDestroy() {
    this.producer.disconnect()
    this.consumer.disconnect()
  }

  constructor(
    @InjectRepository(TravelPayment)
    private travelPaymentRepository: Repository<TravelPayment>,
    @InjectRepository(HikePayment)
    private hikePaymentRepository: Repository<HikePayment>,
    private readonly queryCacheService: QueryCacheService
  ) {}

  sendTravelPaymentEvent(event: BaseTravelPaymentEvent) {
    this.producer.send({
      topic: this.TRAVEL_PAYMENTS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  sendHikePaymentEvent(event: BaseHikePaymentEvent) {
    this.producer.send({
      topic: this.HIKE_PAYMENTS_TOPIC,
      messages: [{ value: JSON.stringify(event) }]
    })
  }

  private async subscribe() {
    await Promise.all([this.hikePaymentRepository.delete({}), this.travelPaymentRepository.delete({})])
    await this.consumer.connect()
    await this.consumer.subscribe({
      topics: [
        this.USERS_TOPIC,
        this.TRAVEL_PAYMENTS_TOPIC,
        this.TRAVEL_BOOKINGS_TOPIC,
        this.HIKE_PAYMENTS_TOPIC,
        this.HIKE_BOOKINGS_TOPIC
      ],
      fromBeginning: true
    })

    this.consumer.run({
      eachMessage: async ({ topic, partition: _, message }) => {
        let event: BaseEvent<any, any>
        switch (topic) {
          case this.TRAVEL_BOOKINGS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseTravelBookingEvent
            switch (event.type) {
              case TravelBookingEventType.DELETE:
                this.handleTravelBookingDeleted(event.data)
                break
              case TravelBookingEventType.UPDATE:
                this.handleTravelBookingUpdated(event.data)
                break
              case TravelBookingEventType.CREATE:
                this.handleTravelBookingCreated(event.data)
                break
            }
            break
          case this.HIKE_BOOKINGS_TOPIC:
            event = JSON.parse(message.value.toString()) as BaseHikeBookingEvent
            switch (event.type) {
              case TravelBookingEventType.DELETE:
                this.handleHikeBookingDeleted(event.data)
                break
              case TravelBookingEventType.UPDATE:
                this.handleHikeBookingUpdated(event.data)
                break
              case TravelBookingEventType.CREATE:
                this.handleHikeBookingCreated(event.data)
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

  private handleUserDeleted(data: UserTopicPayload) {
    console.log(`User deleted: ${data.id}`)
    this.travelPaymentRepository.delete({
      user_id: data.id
    })
    this.hikePaymentRepository.delete({
      user_id: data.id
    })
  }

  private async handleTravelBookingDeleted(data: TravelBookingTopicPayload) {
    console.log(`Travel Booking deleted: ${data.id}`)
    const payment = await this.travelPaymentRepository.findOneBy({
      booking_id: data.id
    })
    this.queryCacheService.invalidate({
      couples: [{ key: "TRAVEL_PAYMENT", all: true }],
      promise: this.travelPaymentRepository.remove(payment)
    })
  }

  private async handleTravelBookingUpdated(data: TravelBookingTopicPayload) {
    console.log(`Travel Booking updated: ${data.id}`)
    const payment = await this.travelPaymentRepository.findOneBy({
      booking_id: data.id
    })
    if (data.price !== undefined) payment.amount = data.price

    if (data.method !== undefined) payment.method = data.method as PaymentMethod
    if (data.paid !== undefined) payment.paid = data.paid

    this.queryCacheService.invalidate({
      couples: [{ key: "TRAVEL_PAYMENT", all: true }],
      promise: this.travelPaymentRepository.save(payment)
    })
  }

  private handleTravelBookingCreated(data: TravelBookingTopicPayload) {
    console.log(`Travel Booking created: ${data.id}`)
    this.travelPaymentRepository.save({
      amount: data.price + "",
      booking_id: data.id,
      user_id: data.user_id,
      client_secret: null,
      method: PaymentMethod.CARD,
      paid: false,
      stripe_payment_id: null
    })
  }

  private async handleHikeBookingDeleted(data: HikeBookingTopicPayload) {
    console.log(`Hike Booking deleted: ${data.id}`)
    const payment = await this.hikePaymentRepository.findOneBy({
      booking_id: data.id
    })
    this.queryCacheService.invalidate({
      couples: [{ key: "HIKE_PAYMENT", all: true }],
      promise: this.hikePaymentRepository.remove(payment)
    })
  }

  private async handleHikeBookingUpdated(data: HikeBookingTopicPayload) {
    console.log(`Hike Booking updated: ${data.id}`)
    const payment = await this.hikePaymentRepository.findOneBy({
      booking_id: data.id
    })
    if (data.price !== undefined) payment.amount = data.price

    if (data.method !== undefined) payment.method = data.method as PaymentMethod
    if (data.paid !== undefined) payment.paid = data.paid

    this.queryCacheService.invalidate({
      couples: [{ key: "HIKE_PAYMENT", all: true }],
      promise: this.hikePaymentRepository.save(payment)
    })
  }

  private handleHikeBookingCreated(data: HikeBookingTopicPayload) {
    console.log(`Hike Booking created: ${data.id}`)
    this.hikePaymentRepository.save({
      amount: data.price + "",
      booking_id: data.id,
      user_id: data.user_id,
      client_secret: null,
      method: PaymentMethod.CARD,
      paid: false,
      stripe_payment_id: null
    })
  }
}
