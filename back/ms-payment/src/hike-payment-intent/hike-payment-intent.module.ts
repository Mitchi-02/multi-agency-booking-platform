import { Module } from "@nestjs/common"
import { StripeModule } from "src/stripe/stripe.module"
import { HikePaymentIntentService } from "./hike-payment-intent.service"
import { HikePaymentIntentController } from "./hike-payment-intent.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { HikePayment } from "src/models/hike-payment.entity"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([HikePayment]), QueryCacheModule, KafkaModule],
  controllers: [HikePaymentIntentController],
  providers: [HikePaymentIntentService],
  exports: [HikePaymentIntentService]
})
export class HikePaymentIntentModule {}
