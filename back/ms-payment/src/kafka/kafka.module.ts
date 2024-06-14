import { Module } from "@nestjs/common"
import { KafkaService } from "./kafka.service"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { TravelPayment } from "src/models/travel-payment.entity"
import { HikePayment } from "src/models/hike-payment.entity"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [TypeOrmModule.forFeature([TravelPayment, HikePayment]), QueryCacheModule],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}
