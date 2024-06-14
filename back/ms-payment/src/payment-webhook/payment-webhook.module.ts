import { Module } from "@nestjs/common"
import { PaymentWebhookController } from "./payment-webhook.controller"
import { TravelPaymentIntentModule } from "src/travel-payment-intent/travel-payment-intent.module"
import { StripeModule } from "src/stripe/stripe.module"
import { HikePaymentIntentModule } from "src/hike-payment-intent/hike-payment-intent.module"

@Module({
  imports: [TravelPaymentIntentModule, HikePaymentIntentModule, StripeModule],
  controllers: [PaymentWebhookController]
})
export class PaymentWebhookModule {}
