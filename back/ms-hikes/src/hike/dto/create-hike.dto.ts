import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min, MinDate } from "class-validator"
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from "nestjs-form-data"
import { IsAfter, IsValidArray } from "src/utils/validation.options"

export class ComplementaryServiceDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string

  @Min(0, { message: "Price should be positive" })
  @IsNumber({}, { message: "Price should be a number" })
  @Type(() => Number)
  price: number

  @IsString({ message: "Type must be a string" })
  @IsNotEmpty({ message: "Type is required" })
  type: string
}

export class PlanStepDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title: string

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  description: string
}

export class CreateHikeDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title: string

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  description: string

  @IsString({ message: "Destination must be a string" })
  @IsNotEmpty({ message: "Destination is required" })
  destination: string

  @MinDate(new Date(), { message: "Departure date must be in the future" })
  @Type(() => Date)
  departure_date: Date

  @IsAfter("departure_date", { message: "Return date must be after departure date" })
  @Type(() => Date)
  return_date: Date

  @IsString({ message: "Departure place must be a string" })
  @IsNotEmpty({ message: "Departure place is required" })
  departure_place: string

  @Min(0, { message: "Adult price should be positive" })
  @IsNumber({}, { message: "Adult price should be a number" })
  @Type(() => Number)
  adult_price: number

  @Min(0, { message: "Kid price should be positive" })
  @IsNumber({}, { message: "Kid price should be a number" })
  @Type(() => Number)
  kid_price: number

  @Min(1, { message: "total_limit should be greater then 0" })
  @IsInt({ message: "total_limit should be an integer" })
  @Type(() => Number)
  total_limit: number

  @HasMimeType(["image/jpeg", "image/png", "image/svg", "image/webp", "image/gif", "image/jpg"], {
    message: "Photos must be of type jpeg, png, svg, webp, gif, jpg",
    each: true
  })
  @MaxFileSize(2e6, { each: true, message: "Photos must be less than 200mb" })
  @IsFiles({ message: "Photos must be files" })
  @IsOptional()
  photos?: MemoryStoredFile[]

  @IsValidArray(ComplementaryServiceDto, {
    message: "Complementary services must be an array of objects with name and price each"
  })
  @IsOptional()
  complementary_services?: string[]

  @IsValidArray(PlanStepDto, {
    message: "plan must be an array of objects with title and description each"
  })
  @IsOptional()
  plan?: string[]
}
