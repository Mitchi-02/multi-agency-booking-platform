import * as z from "zod"
import { CreateHikeSchema, UpdateBookingSchema, UpdateHikeSchema } from "../schemas/hike"

export interface BookingUI {
  _id: string
  hike_departure_date: string
  hike_destination: string
  hike_id: string
  price: number
  paid: "Paid" | "Not Payed"
  method: string
  updatedAt: string
  total: number
  user_photo: string
  user_name: string
}

export interface ReviewUI {
  _id: string
  user_photo: string
  user_name: string
  rating: number
  createdAt: string
  comment: string
}

export type UpdateBookingSchemaType = z.infer<typeof UpdateBookingSchema>
export type CreateHikeSchemaType = z.infer<typeof CreateHikeSchema>
export type UpdateHikeSchemaType = z.infer<typeof UpdateHikeSchema>
