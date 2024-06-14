import { Module } from "@nestjs/common"
import { HikeBookingController } from "./hike-booking.controller"
import { HikeBookingService } from "./hike-booking.service"
import { MongooseModule } from "@nestjs/mongoose"
import { HikeBooking, HikeBookingSchema } from "src/schemas/HikeBooking.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeBooking.name,
        schema: HikeBookingSchema
      }
    ]),
    QueryCacheModule
  ],
  exports: [HikeBookingService],
  controllers: [HikeBookingController],
  providers: [HikeBookingService]
})
export class HikeBookingModule {}
