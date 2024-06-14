import { Injectable } from "@nestjs/common"
import Stripe from "stripe"

@Injectable()
export class StripeService {
  private stripe: Stripe
  static readonly CURRENCY = "DZD"
  private readonly webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10"
    })
  }

  createPaymentIntent(amount: string, type: "travel" | "hike") {
    return this.stripe.paymentIntents.create({
      amount: parseFloat(amount) * 100,
      currency: StripeService.CURRENCY,
      payment_method_types: ["card"],
      metadata: {
        type
      }
    })
  }

  constructEventFromPayload(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret)
  }
}
