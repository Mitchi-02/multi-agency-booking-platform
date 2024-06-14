import * as z from "zod"
import { BookingSchema } from "../schemas/booking"

export interface BookingFormData {
  kids: number
  adults: number
  services: string[]
}

export type BookingSchemaType = z.infer<typeof BookingSchema>
