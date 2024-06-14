import { Controller, Headers, Post, Req } from "@nestjs/common"

import { BaseController } from "src/utils/base.controller"
import { TravelPaymentIntentService } from "src/travel-payment-intent/travel-payment-intent.service"
import { RequestWithRawBody } from "src/utils/rawBodyMiddleware"
import { StripeService } from "src/stripe/stripe.service"
import { PaymentMethod } from "src/models"
import Stripe from "stripe"
import { HikePaymentIntentService } from "src/hike-payment-intent/hike-payment-intent.service"

@Controller("/webhook")
export class PaymentWebhookController extends BaseController {
  constructor(
    private readonly travelPaymentIntentService: TravelPaymentIntentService,
    private readonly hikePaymentIntentService: HikePaymentIntentService,
    private readonly stripeService: StripeService
  ) {
    super()
  }

  @Post()
  async stripeWebhook(@Headers("stripe-signature") signature: string, @Req() request: RequestWithRawBody) {
    if (!signature) {
      return this.sendErrorResponse("No signature provided", 400)
    }
    let event: Stripe.Event | null = null

    try {
      event = this.stripeService.constructEventFromPayload(signature, request.rawBody)
      console.log(event)
    } catch (err) {
      return this.sendErrorResponse("Bad signature provided", 400)
    }

    if (event.type === "payment_intent.succeeded") {
      if (event.data.object.metadata.type === "travel") {
        this.travelPaymentIntentService
          .findOneBy({
            stripe_payment_id: event.data.object.id
          })
          .then((paymentIntent) => {
            if (!paymentIntent) {
              return
            }
            this.travelPaymentIntentService.updatePaymentIntent(paymentIntent, {
              paid: true,
              method: PaymentMethod.CARD
            })
          })
      } else if (event.data.object.metadata.type === "hike") {
        this.hikePaymentIntentService
          .findOneBy({
            stripe_payment_id: event.data.object.id
          })
          .then((paymentIntent) => {
            if (!paymentIntent) {
              return
            }
            this.hikePaymentIntentService.updatePaymentIntent(paymentIntent, {
              paid: true,
              method: PaymentMethod.CARD
            })
          })
      }
    }

    return { received: true }
  }
}
