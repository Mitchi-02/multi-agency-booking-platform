import { Type } from "class-transformer"
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, MinDate } from "class-validator"
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from "nestjs-form-data"
import { IsAfter, IsValidArray } from "src/utils/validation.options"
import { ComplementaryServiceDto, PlanStepDto } from "./create-travel.dto"
import { Travel, TravelExperience, TravelRegion, TravelTransportationType } from "src/schemas/Travel.schema"

export class UpdateTravelDto {
  @IsString({ message: "Title must be a string" })
  @IsOptional()
  title?: string

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string

  @IsString({ message: "Hotel must be a string" })
  @IsOptional()
  hotel?: string

  @IsString({ message: "Destination must be a string" })
  @IsOptional()
  destination?: string

  @MinDate(new Date(), { message: "Departure date must be in the future" })
  @Type(() => Date)
  @IsOptional()
  departure_date?: Date

  @IsAfter("departure_date", { message: "Return date must be after departure date" })
  @Type(() => Date)
  @IsOptional()
  return_date?: Date

  @IsString({ message: "Departure place must be a string" })
  @IsOptional()
  departure_place?: string

  @Min(0, { message: "Adult price should be positive" })
  @IsNumber({}, { message: "Adult price should be a number" })
  @Type(() => Number)
  @IsOptional()
  adult_price?: number

  @Min(0, { message: "Kid price should be positive" })
  @IsNumber({}, { message: "Kid price should be a number" })
  @Type(() => Number)
  @IsOptional()
  kid_price?: number

  @Min(1, { message: "Total limit should be greater then 0" })
  @IsInt({ message: "Total limit should be an integer" })
  @Type(() => Number)
  @IsOptional()
  total_limit?: number

  @Min(0, { message: "Places left should be greater then 0" })
  @IsInt({ message: "Places left should be an integer" })
  @Type(() => Number)
  @IsOptional()
  places_left?: number

  @HasMimeType(["image/jpeg", "image/png", "image/svg", "image/webp", "image/gif", "image/jpg"], {
    message: "Photos must be of type jpeg, png, svg, webp, gif, jpg",
    each: true
  })
  @MaxFileSize(2e6, { each: true, message: "Photos must be less than 200mb" })
  @IsFiles({ message: "Photos must be files" })
  @IsOptional()
  new_photos?: MemoryStoredFile[]

  @IsArray({ message: "Deleted photos must be an array" })
  @IsOptional()
  deleted_photos?: string[]

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

  @IsEnum(Travel.REGIONS, { message: "Region must be one of the predefined regions" })
  @IsOptional()
  region?: TravelRegion

  @IsEnum(Travel.TRANSPORTATION_TYPES, { message: "Transportation must be one of the predefined transportation types" })
  @IsOptional()
  transportation_type?: TravelTransportationType

  @IsEnum(Travel.TRAVEL_EXPERIENCES, { message: "Experiences must be one of the predefined experiences", each: true })
  @IsArray({ message: "Experiences must be an array" })
  @IsOptional()
  experiences?: TravelExperience[]
}
