import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelReview, TravelReviewSchema } from "src/schemas/TravelReview.schema"
import { TravelBookingModule } from "src/travel-booking/travel-booking.module"
import { TravelModule } from "src/travel/travel.module"
import { TravelReviewController } from "./travel-review.controller"
import { TravelReviewService } from "./travel-review.service"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelReview.name,
        schema: TravelReviewSchema
      }
    ]),
    TravelModule,
    TravelBookingModule,
    KafkaModule,
    QueryCacheModule
  ],
  controllers: [TravelReviewController],
  providers: [TravelReviewService]
})
export class TravelReviewModule {}
