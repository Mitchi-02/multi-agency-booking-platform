import { IsOptional } from "class-validator"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

export class SearchAgenciesQueryDto extends PaginationQueryDto {
  @IsOptional()
  is_complete?: string
}
