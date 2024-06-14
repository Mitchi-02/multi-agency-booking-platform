import * as z from "zod"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
export interface SocialMedia {}

export const AddTravelAgencySchema = z.object({
  name: z.string().min(1, { message: "Travel Agency Name is required" }),
  description: z.string().optional(),
  logo: z
    .instanceof(File)
    .or(z.string())
    .refine((file) => typeof file === "string" || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type. Accepted types are jpeg, jpg, png, webp."
    }),
  photos: z.array(z.instanceof(File)),
  contact_email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  social_media: z.record(z.string()).default({}),
  rating: z.number().optional()
})

export const AddHikingAgencySchema = z.object({
  name: z.string().min(1, { message: "Travel Agency Name is required" }),
  description: z.string().optional(),
  logo: z
    .instanceof(File)
    .or(z.string())
    .refine((file) => typeof file === "string" || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type. Accepted types are jpeg, jpg, png, webp."
    }),
  photos: z.array(z.instanceof(File)),
  contact_email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  social_media: z.record(z.string()).default({}),
  rating: z.number().optional()
})

export const UpdateRequestSchema = z.object({
  status: z.string().min(1, { message: "Status is required" })
})

export const UpdateHikeAgencySchema = z.object({
  name: z.string().min(1, { message: "Hike Agency Name is required" }),
  logo: z
    .instanceof(File)
    .or(z.string())
    .refine((file) => typeof file === "string" || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type. Accepted types are jpeg, jpg, png, webp."
    }),
  contact_email: z.string().email().optional(),
  phone: z.string().min(10, { message: "Invalid phone number" }),
  address: z.string().min(1, { message: "Address is required" }),
  social_media: z.record(z.string()).default({}),
  new_photos: z.array(z.instanceof(File)),
  deleted_photos: z.array(z.string()),
  description: z.string().min(1, { message: "Description is required" })
})

export const UpdateTravelAgencySchema = z.object({
  name: z.string().min(1, { message: "Hike Agency Name is required" }),
  logo: z
    .instanceof(File)
    .or(z.string())
    .refine((file) => typeof file === "string" || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type. Accepted types are jpeg, jpg, png, webp."
    }),
  contact_email: z.string().email().min(1, { message: "Contact Email is required" }),
  phone: z.string().min(10, { message: "Invalid phone number" }),
  address: z.string().min(1, { message: "Address is required" }),
  social_media: z.record(z.string()).default({}),
  new_photos: z.array(z.instanceof(File)),
  deleted_photos: z.array(z.string()),
  description: z.string().min(1, { message: "Description is required" })
})
