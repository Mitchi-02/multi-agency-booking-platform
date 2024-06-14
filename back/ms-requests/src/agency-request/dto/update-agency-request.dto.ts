import { AgencyRequestStatus } from "src/schemas/AgencyRequest.schema"
import { IsEnum } from "class-validator"

export class UpdateAgencyRequestDto {
  @IsEnum(AgencyRequestStatus, { message: "Invalid status"})
  status: AgencyRequestStatus
}
