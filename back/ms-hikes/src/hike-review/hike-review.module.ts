import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { HikeReview, HikeReviewSchema } from "src/schemas/HikeReview.schema"
import { HikeBookingModule } from "src/hike-booking/hike-booking.module"
import { HikeModule } from "src/hike/hike.module"
import { HikeReviewController } from "./hike-review.controller"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { HikeReviewService } from "./hike-review.service"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeReview.name,
        schema: HikeReviewSchema
      }
    ]),
    HikeModule,
    HikeBookingModule,
    QueryCacheModule,
    KafkaModule
  ],
  controllers: [HikeReviewController],
  providers: [HikeReviewService]
})
export class HikeReviewModule {}
