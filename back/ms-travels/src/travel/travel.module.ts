import { Module } from "@nestjs/common"
import { TravelService } from "./travel.service"
import { TravelController } from "./travel.controller"
import { NestjsFormDataModule } from "nestjs-form-data"
import { MongooseModule } from "@nestjs/mongoose"
import { Travel, TravelSchema } from "src/schemas/Travel.schema"
import { StorageModule } from "src/storage/storage.module"
import { TravelAgencyModule } from "src/travel-agency/travel-agency.module"
import { QueryCacheModule } from "src/query-cache/query-cache.module"
import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Travel.name,
        schema: TravelSchema
      }
    ]),
    NestjsFormDataModule,
    StorageModule,
    QueryCacheModule,
    TravelAgencyModule,
    KafkaModule
  ],
  exports: [TravelService],
  controllers: [TravelController],
  providers: [TravelService]
})
export class TravelModule {}
