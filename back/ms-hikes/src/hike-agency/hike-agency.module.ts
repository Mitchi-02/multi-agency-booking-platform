import { Module } from "@nestjs/common"
import { HikeAgencyService } from "./hike-agency.service"
import { HikeAgencyController } from "./hike-agency.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { HikeAgency, HikeAgencySchema } from "src/schemas/HikeAgency.schema"
import { StorageModule } from "src/storage/storage.module"
import { NestjsFormDataModule } from "nestjs-form-data"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HikeAgency.name,
        schema: HikeAgencySchema
      }
    ]),
    StorageModule,
    QueryCacheModule,
    NestjsFormDataModule,
    KafkaModule
  ],
  controllers: [HikeAgencyController],
  providers: [HikeAgencyService],
  exports: [HikeAgencyService]
})
export class HikeAgencyModule {}
