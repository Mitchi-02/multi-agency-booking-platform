import { BookingStatus, BookingType, PaymentMethod } from "../types"

export type ListTravelBooking = {
  _id: string
  createdAt: string
  updatedAt: string
  travel: {
    _id: string
    departure_date: string
    destination: string
  }
  travel_agency: {
    _id: string
    name: string
  }
  booking_items: BookingItem[]
  price: number
  paid: boolean
  method: PaymentMethod
}

export type CompleteTravelBooking = {
  _id: string
  createdAt: string
  updatedAt: string
  travel: {
    _id: string
  }
  travel_agency: {
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

export type TravelPayment = {
  id: number
  booking_id: string
  amount: string
  client_secret: string
  method: PaymentMethod
  paid: boolean
}
