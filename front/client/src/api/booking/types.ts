export type SingleBookingPost = {
  full_name: string
  phone: string
  type: BookingType
  chosen_services: string[]
}

export type BookingType = "adult" | "kid"
export type BookingStatus = "pending" | "confirmed" | "cancelled"
export enum PaymentMethod {
  CASH = "cash",
  CARD = "card"
}
