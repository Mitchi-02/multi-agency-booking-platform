import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { StripeService } from "src/stripe/stripe.service"
import { Repository } from "typeorm"
import { PaymentMethod } from "src/models"
import { HikePayment } from "src/models/hike-payment.entity"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { HikePaymentUpdatedEvent } from "src/kafka/core/travel-payments copy/events"

@Injectable()
export class HikePaymentIntentService {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(HikePayment)
    private paymentRepository: Repository<HikePayment>,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  async updatePaymentIntent(
    payment: HikePayment,
    data: {
      method?: PaymentMethod
      paid?: boolean
    }
  ) {
    if (data.method !== undefined) {
      payment.method = data.method
      if (data.method === PaymentMethod.CASH) {
        payment.client_secret = null
        payment.stripe_payment_id = null
      }
    }
    if (data.paid !== undefined) payment.paid = data.paid

    const res = await this.queryCacheService.invalidate({
      couples: [{ key: "HIKE_PAYMENT", all: true }],
      promise: this.paymentRepository.save(payment)
    })

    this.kafkaService.sendHikePaymentEvent(
      new HikePaymentUpdatedEvent({
        booking_id: payment.booking_id,
        method: payment.method,
        paid: payment.paid
      })
    )

    return res
  }

  deletePaymentIntent(payment: HikePayment) {
    return this.queryCacheService.invalidate({
      couples: [{ key: "HIKE_PAYMENT", all: true }],
      promise: this.paymentRepository.remove(payment)
    })
  }

  findOneBy({
    booking_id,
    user_id,
    stripe_payment_id
  }: {
    booking_id?: string
    user_id?: number
    stripe_payment_id?: string
  }) {
    const query = {}
    if (booking_id) query["booking_id"] = booking_id
    if (user_id) query["user_id"] = user_id
    if (stripe_payment_id) query["stripe_payment_id"] = stripe_payment_id
    return this.queryCacheService.get<HikePayment>({
      key: "HIKE_PAYMENT",
      promise: this.paymentRepository.findOne({ where: query }),
      value: JSON.stringify(query)
    })
  }

  async createPaymentIntentSecret(payment: HikePayment) {
    const res = await this.stripeService.createPaymentIntent(payment.amount, "hike")
    payment.stripe_payment_id = res.id
    payment.client_secret = res.client_secret
    const res2 = await this.queryCacheService.invalidate({
      couples: [{ key: "HIKE_PAYMENT", all: true }],
      promise: this.paymentRepository.save(payment)
    })
    return res2
  }
}
