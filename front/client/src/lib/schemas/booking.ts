import * as z from "zod"

export const BookingSchema = z.object({
  adults: z.record(
    z.object({
      full_name: z.string().min(1, { message: "Full Name is required" }).min(3, { message: "At least 3 characters" }),
      phone: z.string().min(7, { message: "Invalid phone number" }),
      chosen_services: z.array(z.string())
    })
  ),
  kids: z.record(
    z.object({
      full_name: z.string().min(1, { message: "Full Name is required" }).min(3, { message: "At least 3 characters" }),
      phone: z.string().min(7, { message: "Invalid phone number" }),
      chosen_services: z.array(z.string())
    })
  )
})
