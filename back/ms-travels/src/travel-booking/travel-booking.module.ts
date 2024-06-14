import { Module } from "@nestjs/common"
import { TravelBookingController } from "./travel-booking.controller"
import { TravelBookingService } from "./travel-booking.service"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelBooking, TravelBookingSchema } from "src/schemas/TravelBooking.schema"
import { TravelModule } from "src/travel/travel.module"
import { TravelAgencyModule } from "src/travel-agency/travel-agency.module"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelBooking.name,
        schema: TravelBookingSchema
      }
    ]),
    TravelModule,
    TravelAgencyModule,
    QueryCacheModule,
    KafkaModule
  ],
  exports: [TravelBookingService],
  controllers: [TravelBookingController],
  providers: [TravelBookingService]
})
export class TravelBookingModule {}
