import { Module } from "@nestjs/common"
import { HikeBookingController } from "./hike-booking.controller"
import { HikeBookingService } from "./hike-booking.service"
import { MongooseModule } from "@nestjs/mongoose"
import { Hike, HikeSchema } from "src/schemas/Hike.schema"
import { HikeModule } from "src/hike/hike.module"
import { HikeAgencyModule } from "src/hike-agency/hike-agency.module"
import { HikeBooking, HikeBookingSchema } from "src/schemas/HikeBooking.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeBooking.name,
        schema: HikeBookingSchema
      }
    ]),
    HikeModule,
    HikeAgencyModule,
    QueryCacheModule,
    KafkaModule
  ],
  exports: [HikeBookingService],
  controllers: [HikeBookingController],
  providers: [HikeBookingService]
})
export class HikeBookingModule {}
