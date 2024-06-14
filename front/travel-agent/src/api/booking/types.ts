export type Booking = {
  _id: string
  travel: {
    _id: string
    departure_date: string
    destination: string
  }
  price: number
  user: BookingUser
  paid: boolean
  method: string
  createdAt: string
  updatedAt: string
  booking_items: BookingItem[]
}

export type BookingItem = {
  _id: string
  full_name: string
  phone: string
  type: string
  status: string
  price: number
  chosen_services: string[]
}

export type BookingDetails = {
  _id: string
  travel: {
    _id: string
    places_left: number
    destination: string
    title: string
  }
  user: BookingUser
  price: number
  paid: boolean
  method: string
  updatedAt: string
  booking_items: BookingItem[]
}

export type BookingUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_picture: string
}