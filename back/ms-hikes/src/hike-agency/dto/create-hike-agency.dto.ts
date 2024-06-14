import { IsEmail, IsJSON, IsNotEmpty, IsNumberString, IsOptional, IsString, Min } from "class-validator"
import { HasMimeType, IsFile, IsFiles, MaxFileSize, MemoryStoredFile } from "nestjs-form-data"

export class CreateHikeAgencyDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string

  @IsString({ message: "Address must be a string" })
  @IsOptional()
  address?: string

  @IsString({ message: "Phone must be a string" })
  @IsOptional()
  phone?: string

  @IsEmail({}, { message: "Contact email must be a valid email" })
  @IsOptional()
  contact_email?: string

  @HasMimeType(["image/jpeg", "image/png", "image/svg", "image/webp", "image/gif", "image/jpg"], {
    message: "Photos must be of type jpeg, png, svg, webp, gif, jpg",
    each: true
  })
  @MaxFileSize(2e6, { each: true, message: "Photos must be less than 200mb" })
  @IsFiles({ message: "Photos must be files" })
  @IsOptional()
  photos?: MemoryStoredFile[]

  @HasMimeType(["image/jpeg", "image/png", "image/svg", "image/webp", "image/gif", "image/jpg"], {
    message: "Logo must be of type jpeg, png, svg, webp, gif, jpg",
    each: true
  })
  @MaxFileSize(2e6, { each: true, message: "Logo must be less than 200mb" })
  @IsFile({ message: "Logo must be a file" })
  @IsOptional()
  logo?: MemoryStoredFile

  @IsJSON({ message: "Social media must be a json" })
  social_media: string

  @Min(0, { message: "rating should be greater or equal than 0" })
  @IsNumberString({}, { message: "rating should be a string number" })
  @IsOptional()
  rating?: string
}
