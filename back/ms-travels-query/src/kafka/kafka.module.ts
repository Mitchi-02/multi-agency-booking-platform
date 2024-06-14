import { Module } from "@nestjs/common"
import { KafkaService } from "./kafka.service"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelBooking, TravelBookingSchema } from "src/schemas/TravelBooking.schema"
import { TravelReview, TravelReviewSchema } from "src/schemas/TravelReview.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { ProxyModule } from "src/proxy/proxy.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelBooking.name,
        schema: TravelBookingSchema
      },
      {
        name: TravelReview.name,
        schema: TravelReviewSchema
      }
    ]),
    ProxyModule,
    QueryCacheModule
  ],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}
