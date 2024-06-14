import { Module } from "@nestjs/common"
import { SeederService } from "./seeder.service"
import { MongooseModule } from "@nestjs/mongoose"
import { AgencyRequest, AgencyRequestSchema } from "src/schemas/AgencyRequest.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AgencyRequest.name,
        schema: AgencyRequestSchema
      }
    ])
  ],
  providers: [SeederService]
})
export class SeederModule {}
