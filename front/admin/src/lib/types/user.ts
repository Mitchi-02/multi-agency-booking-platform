import {
  ChangePasswordSchema,
  ProfileSchema,
  ForgotPasswordSchema,
  LoginSchema,
  AddUserSchema
} from "@/lib/schemas/user"
import * as z from "zod"

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>
export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>
export type ProfilePictureType = { profile_picture: File }
export type ProfileSchemaType = Partial<z.infer<typeof ProfileSchema>>
export type AddUserSchemaType = z.infer<typeof AddUserSchema>
