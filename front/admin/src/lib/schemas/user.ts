import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" })
})

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email()
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

export enum Role {
  TRAVEL_AGENT = "TRAVEL_AGENT",
  HIKE_AGENT = "HIKE_AGENT",
  ADMIN = "ADMIN",
  CLIENT = "CLIENT"
}

export const AddUserSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    role: z.enum([Role.TRAVEL_AGENT, Role.HIKE_AGENT, Role.ADMIN, Role.CLIENT]),
    organization_id: z.string().optional(),
    first_name: z.string().min(1, { message: "First Name is required" }),
    last_name: z.string().min(1, { message: "Last Name is required" }),
    gender: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    birth_date: z.string().optional()
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"]
  })
