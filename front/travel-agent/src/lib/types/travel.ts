import * as z from "zod"
import { CreateTravelSchema, UpdateBookingSchema, UpdateTravelSchema } from "../schemas/travel"

export interface BookingUI {
  _id: string
  travel_departure_date: string
  travel_destination: string
  travel_id: string
  price: number
  paid: 'Paid' | 'Not Payed'
  user_photo: string
  user_name: string
  method: string
  updatedAt: string
  total: number
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

export type CreateTravelSchemaType = z.infer<typeof CreateTravelSchema>
export type UpdateTravelSchemaType = z.infer<typeof UpdateTravelSchema>
