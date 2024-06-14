import { IsArray, IsEmail, IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { HasMimeType, IsFile, IsFiles, MaxFileSize, MemoryStoredFile } from "nestjs-form-data"

export class UpdateTravelAgencyDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  description: string

  @IsString({ message: "Address must be a string" })
  @IsNotEmpty({ message: "Address is required" })
  address: string

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone is required" })
  phone: string

  @IsEmail({}, { message: "Contact email must be a valid email" })
  @IsNotEmpty({ message: "Contact email is required" })
  contact_email: string

  @HasMimeType(["image/jpeg", "image/png", "image/svg", "image/webp", "image/gif", "image/jpg"], {
    message: "Photos must be of type jpeg, png, svg, webp, gif, jpg",
    each: true
  })
  @MaxFileSize(2e6, { each: true, message: "Photos must be less than 200mb" })
  @IsFiles({ message: "Photos must be files" })
  @IsOptional()
  new_photos?: MemoryStoredFile[]

  @HasMimeType(["image/jpeg", "image/png", "image/svg", "image/webp", "image/gif", "image/jpg"], {
    message: "Logo must be of type jpeg, png, svg, webp, gif, jpg",
    each: true
  })
  @MaxFileSize(2e6, { each: true, message: "Logo must be less than 200mb" })
  @IsFile({ message: "Logo must be a file" })
  @IsOptional()
  logo?: MemoryStoredFile

  @IsArray({ message: "Deleted photos must be an array" })
  @IsOptional()
  deleted_photos?: string[]

  @IsJSON({ message: "Social media must be a json" })
  social_media: string
}
