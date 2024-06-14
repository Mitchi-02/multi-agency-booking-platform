import { Module } from "@nestjs/common"
import { KafkaService } from "./kafka.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Hike, HikeSchema } from "src/schemas/Hike.schema"
import { HikeBooking, HikeBookingSchema } from "src/schemas/HikeBooking.schema"
import { HikeReview, HikeReviewSchema } from "src/schemas/HikeReview.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { HikeAgency, HikeAgencySchema } from "src/schemas/HikeAgency.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeAgency.name,
        schema: HikeAgencySchema
      },
      {
        name: Hike.name,
        schema: HikeSchema
      },
      {
        name: HikeBooking.name,
        schema: HikeBookingSchema
      },
      {
        name: HikeReview.name,
        schema: HikeReviewSchema
      }
    ]),
    QueryCacheModule
  ],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}
