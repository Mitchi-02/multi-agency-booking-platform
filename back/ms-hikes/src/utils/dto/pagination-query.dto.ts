import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, Min } from "class-validator"

export class PaginationQueryDto {
  @Min(1, { message: "page should be greater than 0" })
  @IsInt({ message: "page should be a number" })
  @Type(() => Number)
  @IsOptional()
  page?: number

  @Min(1, { message: "page_size should be greater than 0" })
  @IsInt({ message: "page_size should be a number" })
  @Type(() => Number)
  @IsOptional()
  page_size?: number

  @IsString()
  @IsOptional()
  search?: string
}
