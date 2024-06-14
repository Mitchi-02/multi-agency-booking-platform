import { IsEnum, IsOptional } from "class-validator"
import { AgencyRequestStatus } from "src/schemas/AgencyRequest.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

export class SearchRequestsQueryDto extends PaginationQueryDto {
  @IsEnum(AgencyRequestStatus)
  @IsOptional()
  status?: AgencyRequestStatus
}
