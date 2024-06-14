import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AgencyRequest } from "src/schemas/AgencyRequest.schema"

@Injectable()
export class SeederService {
  constructor(@InjectModel(AgencyRequest.name) private requestModel: Model<AgencyRequest>) {}

  onModuleInit() {
    //to make sure ms-users is read
    setTimeout(async () => {
      await this.requestModel.deleteMany({})
      let status = ["pending", "accepted", "refused"]
      for (let i = 0; i < status.length; i++) {
        for (let j = 0; j < 10; j++) {
          await this.requestModel.create({
            email: `request@${status[i]}${j}.com`,
            status: status[i]
          })
        }
      }
    })
  }
}
