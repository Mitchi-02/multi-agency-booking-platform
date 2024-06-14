import {
  ChangePasswordSchema,
  ContactScehma,
  ForgotPasswordSchema,
  LoginSchema,
  ProfileSchema,
  SignUpSchema,
  ValidationSchema
} from "@/lib/schemas/user"
import * as z from "zod"

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type SignUpSchemaType = z.infer<typeof SignUpSchema>
export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>
export type ValidationSchemaType = z.infer<typeof ValidationSchema>
export type ProfileSchemaType = Partial<z.infer<typeof ProfileSchema>>
export type ProfilePictureType = { profile_picture: File }
export type ContactFormType = z.infer<typeof ContactScehma>