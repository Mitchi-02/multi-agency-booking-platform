import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

export class SearchHikesQueryDto extends PaginationQueryDto {
  @Type(() => Date)
  @IsOptional()
  departure_date?: Date

  @IsOptional()
  title?: string

  @Type(() => Date)
  @IsOptional()
  return_date?: Date

  @IsOptional()
  destination?: string

  @IsNumber({}, { message: "price_min should be a number" })
  @Type(() => Number)
  @IsOptional()
  price_min?: number

  @IsNumber({}, { message: "price_max should be a number" })
  @Type(() => Number)
  @IsOptional()
  price_max?: number

  @IsOptional()
  durations?: string | string[]
}
