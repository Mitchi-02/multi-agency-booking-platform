import { IsEmail } from "class-validator"

export class CreateAgencyRequestDto {
  @IsEmail({}, { message: "email is invalid" })
  readonly email: string
}
