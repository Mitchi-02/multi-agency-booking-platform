import { Module } from "@nestjs/common"
import { TravelAgencyService } from "./travel-agency.service"
import { TravelAgencyController } from "./travel-agency.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelAgency, TravelAgencySchema } from "src/schemas/TravelAgency.schema"
import { StorageModule } from "src/storage/storage.module"
import { NestjsFormDataModule } from "nestjs-form-data"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TravelAgency.name,
        schema: TravelAgencySchema
      }
    ]),
    StorageModule,
    QueryCacheModule,
    NestjsFormDataModule,
    KafkaModule
  ],
  controllers: [TravelAgencyController],
  providers: [TravelAgencyService],
  exports: [TravelAgencyService]
})
export class TravelAgencyModule {}
