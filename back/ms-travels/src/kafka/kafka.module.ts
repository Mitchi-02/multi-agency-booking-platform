import { Module } from "@nestjs/common"
import { KafkaService } from "./kafka.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Travel, TravelSchema } from "src/schemas/Travel.schema"
import { TravelBooking, TravelBookingSchema } from "src/schemas/TravelBooking.schema"
import { TravelReview, TravelReviewSchema } from "src/schemas/TravelReview.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { TravelAgency, TravelAgencySchema } from "src/schemas/TravelAgency.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelAgency.name,
        schema: TravelAgencySchema
      },
      {
        name: Travel.name,
        schema: TravelSchema
      },
      {
        name: TravelBooking.name,
        schema: TravelBookingSchema
      },
      {
        name: TravelReview.name,
        schema: TravelReviewSchema
      }
    ]),
    QueryCacheModule
  ],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}
