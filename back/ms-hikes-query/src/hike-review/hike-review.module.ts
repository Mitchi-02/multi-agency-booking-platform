import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { HikeReview, HikeReviewSchema } from "src/schemas/HikeReview.schema"
import { HikeReviewController } from "./hike-review.controller"
import { HikeReviewService } from "./hike-review.service"
import { QueryCacheModule } from "src/query-cache/query-cache.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeReview.name,
        schema: HikeReviewSchema
      }
    ]),
    QueryCacheModule
  ],
  controllers: [HikeReviewController],
  providers: [HikeReviewService]
})
export class HikeReviewModule {}
