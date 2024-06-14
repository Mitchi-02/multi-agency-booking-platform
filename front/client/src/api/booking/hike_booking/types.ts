import { BookingStatus, BookingType, PaymentMethod } from "../types"

export type ListHikeBooking = {
  _id: string
  createdAt: string
  updatedAt: string
  hike: {
    _id: string
    departure_date: string
    destination: string
  }
  hike_agency: {
    _id: string
    name: string
  }
  booking_items: BookingItem[]
  price: number
  paid: boolean
  method: PaymentMethod
}

export type CompleteHikeBooking = {
  _id: string
  createdAt: string
  updatedAt: string
  hike: {
    _id: string
  }
  hike_agency: {
    _id: string
  }
  booking_items: BookingItem[]
  price: number
  paid: boolean
  method: PaymentMethod
}

export type BookingItem = {
  _id: string
  full_name: string
  phone: string
  type: BookingType
  status: BookingStatus
  price: number
  chosen_services: string[]
}

export type HikePayment = {
  id: number
  booking_id: string
  amount: string
  client_secret: string
  method: PaymentMethod
  paid: boolean
}
