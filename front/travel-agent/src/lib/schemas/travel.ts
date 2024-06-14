import * as z from "zod"

export const UpdateBookingSchema = z.object({
  paid: z.boolean(),
  method: z.string().min(1, { message: "Payment method is required" }),
  bookers: z.array(
    z.object({
      full_name: z.string().min(1, { message: "Full name is required" }).min(3, { message: "At least 3 characters" }),
      phone: z.string().min(7, { message: "Invalid phone number" }),
      type: z.string().min(1, { message: "Type is required" }),
      status: z.string().min(1, { message: "Status is required" }),
      chosen_services: z.array(z.string()),
      price: z.number().min(0, { message: "Price is required" })
    })
  )
})

export const CreateTravelSchema = z
  .object({
    title: z.string().min(3, { message: "At least 3 characters" }),
    description: z.string().min(3, { message: "At least 3 characters" }),
    hotel: z.string().min(3, { message: "At least 3 characters" }),
    departure_date: z.string().min(0, { message: "Departure date is required" }),
    return_date: z.string().min(0, { message: "Return date is required" }),
    departure_place: z.string().min(3, { message: "At least 3 characters" }),
    destination: z.string().min(3, { message: "At least 3 characters" }),
    adult_price: z.number().min(0, { message: "Price is required" }),
    kid_price: z.number().min(0, { message: "Price is required" }),
    total_limit: z.number().min(0, { message: "Price is required" }),
    complementary_services: z.array(
      z.object({
        name: z.string().min(3, { message: "At least 3 characters" }),
        price: z.number().min(0, { message: "Price is required" }),
        type: z.string().min(1, { message: "Type is required" })
      })
    ),
    plan: z.array(
      z.object({
        title: z.string().min(3, { message: "At least 3 characters" }),
        description: z.string().min(3, { message: "At least 3 characters" })
      })
    ),
    experiences: z.array(z.string()),
    region: z.string().min(3, { message: "At least 3 characters" }),
    transportation_type: z.string().min(3, { message: "At least 3 characters" }),
    photos: z.array(z.instanceof(File)).length(4, { message: "Only 4 photos are required" })
  })
  .refine((data) => new Date(data.departure_date) > new Date(), {
    message: "Departure date must be greater than current date",
    path: ["departure_date"]
  })
  .refine((data) => new Date(data.departure_date) < new Date(data.return_date), {
    message: "Return date must be greater than departure date",
    path: ["return_date"]
  })

export const UpdateTravelSchema = z
  .object({
    title: z.string().min(3, { message: "At least 3 characters" }),
    description: z.string().min(3, { message: "At least 3 characters" }),
    hotel: z.string().min(3, { message: "At least 3 characters" }),
    departure_date: z.string().min(0, { message: "Departure date is required" }),
    return_date: z.string().min(0, { message: "Return date is required" }),
    departure_place: z.string().min(3, { message: "At least 3 characters" }),
    destination: z.string().min(3, { message: "At least 3 characters" }),
    adult_price: z.number().min(0, { message: "Price is required" }),
    kid_price: z.number().min(0, { message: "Price is required" }),
    total_limit: z.number().min(0, { message: "Price is required" }),
    complementary_services: z.array(
      z.object({
        name: z.string().min(3, { message: "At least 3 characters" }),
        price: z.number().min(0, { message: "Price is required" }),
        type: z.string().min(1, { message: "Type is required" })
      })
    ),
    plan: z.array(
      z.object({
        title: z.string().min(3, { message: "At least 3 characters" }),
        description: z.string().min(3, { message: "At least 3 characters" })
      })
    ),
    experiences: z.array(z.string()),
    region: z.string().min(3, { message: "At least 3 characters" }),
    transportation_type: z.string().min(3, { message: "At least 3 characters" }),
    new_photos: z.array(z.instanceof(File)),
    deleted_photos: z.array(z.string())
  })
  .refine((data) => new Date(data.departure_date) > new Date(), {
    message: "Departure date must be greater than current date",
    path: ["departure_date"]
  })
  .refine((data) => data.departure_date < data.return_date, {
    message: "Return date must be greater than departure date",
    path: ["return_date"]
  })
  .refine((data) => data.new_photos.length === data.deleted_photos.length, {
    message: "New photos and deleted photos must have the same length",
    path: ["new_photos"]
  })
