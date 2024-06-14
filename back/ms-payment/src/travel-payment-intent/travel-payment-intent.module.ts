import { Module } from "@nestjs/common"
import { StripeModule } from "src/stripe/stripe.module"
import { TravelPaymentIntentService } from "./travel-payment-intent.service"
import { TravelPaymentIntentController } from "./travel-payment-intent.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TravelPayment } from "src/models/travel-payment.entity"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([TravelPayment]), QueryCacheModule, KafkaModule],
  controllers: [TravelPaymentIntentController],
  providers: [TravelPaymentIntentService],
  exports: [TravelPaymentIntentService]
})
export class TravelPaymentIntentModule {}
