import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" })
})

export const SignUpSchema = z
  .object({
    first_name: z.string().min(1, { message: "First Name is required" }).min(3, { message: "At least 3 characters" }),
    last_name: z.string().min(1, { message: "Last Name is required" }).min(3, { message: "At least 3 characters" }),
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    phone: z.string().min(10, { message: "Invalid phone number" }),
    address: z.string().min(1, { message: "Address is required" }),
    birth_date: z.string(),
    gender: z.enum(["MALE", "FEMALE"])
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"] // specify the field that the error is associated with
  })

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email()
})

export const ValidationSchema = z.object({
  code: z.string().length(6)
})

export const ChangePasswordSchema = z
  .object({
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    code: z.string().length(6)
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"]
  })

export const ProfileSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }).min(3, { message: "At least 3 characters" }),
  last_name: z.string().min(1, { message: "Last Name is required" }).min(3, { message: "At least 3 characters" }),
  phone: z.string().min(10, { message: "Invalid phone number" }),
  address: z.string().min(1, { message: "Address is required" }),
  birth_date: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  email: z.string().email()
})

export const ProfilePictureSchema = z.object({
  profile_picture: z.string().url().nullable()
})

export const ContactScehma = z.object({
  email: z.string().min(1, { message: "Email is required" }).email()
})
