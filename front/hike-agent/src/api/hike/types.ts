export type Hike = {
  _id: string
  hike_agency: string
  departure_date: string
  return_date: string
  departure_place: string
  destination: string
  total_limit: number
  places_left: number
}

export type ComplementaryService = {
  name: string
  price: number
  type: string
}

export type PlanStep = {
  title: string
  description: string
}

export type HikeDetails = {
  _id: string
  title: string
  description: string
  photos: [string]
  departure_date: string
  return_date: string
  departure_place: string
  duration: number
  destination: string
  adult_price: number
  kid_price: number
  total_limit: number
  places_left: number
  complementary_services: [ComplementaryService]
  plan: [PlanStep]
  createdAt: string
  updatedAt: string
}

export type HikeFilters = {
  complementary_services_types: {
    id: string
    name: string
  }[]
}
