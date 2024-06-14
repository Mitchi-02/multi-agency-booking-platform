import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString, MaxLength, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { BookingType } from "src/schemas/HikeBooking.schema"

export class BookerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  full_name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string

  @IsEnum(BookingType)
  type: BookingType

  @IsArray()
  @IsString({ each: true })
  chosen_services?: string[]
}

export class CreateHikeBookingDto {
  @IsNotEmpty()
  hike: string

  @ValidateNested({ each: true })
  @Type(() => BookerDto)
  @ArrayMinSize(1, { message: "At least one booker is required" })
  bookers: BookerDto[]
}
