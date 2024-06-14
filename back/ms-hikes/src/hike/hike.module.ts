import { Module } from "@nestjs/common"
import { HikeService } from "./hike.service"
import { HikeController } from "./hike.controller"
import { NestjsFormDataModule } from "nestjs-form-data"
import { MongooseModule } from "@nestjs/mongoose"
import { Hike, HikeSchema } from "src/schemas/Hike.schema"
import { StorageModule } from "src/storage/storage.module"
import { HikeAgencyModule } from "src/hike-agency/hike-agency.module"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hike.name,
        schema: HikeSchema
      }
    ]),
    NestjsFormDataModule,
    StorageModule,
    QueryCacheModule,
    HikeAgencyModule,
    KafkaModule
  ],
  controllers: [HikeController],
  providers: [HikeService],
  exports: [HikeService]
})
export class HikeModule {}
