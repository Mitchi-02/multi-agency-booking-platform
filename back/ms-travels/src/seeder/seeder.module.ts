import { Module } from "@nestjs/common"
import { SeederService } from "./seeder.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Travel, TravelSchema } from "src/schemas/Travel.schema"
import { TravelAgency, TravelAgencySchema } from "src/schemas/TravelAgency.schema"
import { HttpModule } from "@nestjs/axios"
import { TravelBooking, TravelBookingSchema } from "src/schemas/TravelBooking.schema"
import { TravelReview, TravelReviewSchema } from "src/schemas/TravelReview.schema"
import { KafkaModule } from "src/kafka/kafka.module"

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
    HttpModule,
    KafkaModule
  ],
  providers: [SeederService]
})
export class SeederModule {}
