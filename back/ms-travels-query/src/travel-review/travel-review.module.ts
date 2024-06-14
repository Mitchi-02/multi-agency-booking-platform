import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelReview, TravelReviewSchema } from "src/schemas/TravelReview.schema"
import { TravelReviewController } from "./travel-review.controller"
import { TravelReviewService } from "./travel-review.service"
import { QueryCacheModule } from "src/query-cache/query-cache.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelReview.name,
        schema: TravelReviewSchema
      }
    ]),
    QueryCacheModule
  ],
  controllers: [TravelReviewController],
  providers: [TravelReviewService]
})
export class TravelReviewModule {}
