import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, Min } from "class-validator"

export class SuggestHikesQueryDto {
  @Min(1, { message: "page_size should be greater than 0" })
  @IsInt({ message: "page_size should be a number" })
  @Type(() => Number)
  @IsOptional()
  page_size?: number

  @IsString()
  @IsOptional()
  exclude?: string
}
