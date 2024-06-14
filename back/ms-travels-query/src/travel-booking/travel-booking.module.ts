import { Module } from "@nestjs/common"
import { TravelBookingController } from "./travel-booking.controller"
import { TravelBookingService } from "./travel-booking.service"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelBooking, TravelBookingSchema } from "src/schemas/TravelBooking.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelBooking.name,
        schema: TravelBookingSchema
      }
    ]),
    QueryCacheModule
  ],
  exports: [TravelBookingService],
  controllers: [TravelBookingController],
  providers: [TravelBookingService]
})
export class TravelBookingModule {}
