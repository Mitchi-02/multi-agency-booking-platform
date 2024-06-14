import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"

export class CreateHikeReviewDto {
  @IsString()
  @IsNotEmpty()
  booking_id: string

  @IsNumber()
  @IsNotEmpty()
  rating: number

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  comment: string
}
