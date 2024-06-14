import { Type } from "class-transformer"
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator"
import { BookingStatus, BookingType, PaymentMethod } from "src/schemas/HikeBooking.schema"

export class UpdateBookerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  full_name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  phone: string

  @IsEnum(BookingType)
  @IsOptional()
  type: BookingType

  @IsEnum(BookingStatus)
  @IsOptional()
  status: BookingStatus

  @IsArray()
  @IsString({ each: true })
  chosen_services?: string[]
}

export class UpdateHikeBookingDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateBookerDto)
  @ArrayMinSize(1, { message: "At least one booker is required" })
  bookers: UpdateBookerDto[]

  @IsBoolean()
  @IsOptional()
  paid?: boolean

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod
}
