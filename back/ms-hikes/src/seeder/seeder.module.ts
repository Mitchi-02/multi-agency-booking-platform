import { Module } from "@nestjs/common"
import { SeederService } from "./seeder.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Hike, HikeSchema } from "src/schemas/Hike.schema"
import { HikeAgency, HikeAgencySchema } from "src/schemas/HikeAgency.schema"
import { HttpModule } from "@nestjs/axios"
import { HikeBooking, HikeBookingSchema } from "src/schemas/HikeBooking.schema"
import { HikeReview, HikeReviewSchema } from "src/schemas/HikeReview.schema"
import { KafkaModule } from "src/kafka/kafka.module"

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
    HttpModule,
    KafkaModule
  ],
  providers: [SeederService]
})
export class SeederModule {}
