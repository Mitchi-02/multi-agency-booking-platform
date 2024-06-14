import { Module } from "@nestjs/common"
import { AgencyRequestService } from "./agency-request.service"
import { AgencyRequestController } from "./agency-request.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { AgencyRequest, AgencyRequestSchema } from "src/schemas/AgencyRequest.schema"
import { QueryCacheModule } from "src/query-cache/query-cache.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AgencyRequest.name,
        schema: AgencyRequestSchema
      }
    ]),
    QueryCacheModule
  ],
  controllers: [AgencyRequestController],
  providers: [AgencyRequestService]
})
export class AgencyRequestModule {}
