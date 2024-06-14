import { Module } from "@nestjs/common"
import { KafkaService } from "./kafka.service"
import { MongooseModule } from "@nestjs/mongoose"
import { HikeBooking, HikeBookingSchema } from "src/schemas/HikeBooking.schema"
import { HikeReview, HikeReviewSchema } from "src/schemas/HikeReview.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { ProxyModule } from "src/proxy/proxy.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeBooking.name,
        schema: HikeBookingSchema
      },
      {
        name: HikeReview.name,
        schema: HikeReviewSchema
      }
    ]),
    ProxyModule,
    QueryCacheModule
  ],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}
