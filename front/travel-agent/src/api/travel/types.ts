export type Travel = {
  _id: string
  travel_agency: string
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

export type TravelDetails = {
  _id: string
  title: string
  description: string
  hotel: string
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
  experiences: [string]
  region: string
  transportation_type: string
  createdAt: string
  updatedAt: string
}

export type TravelFilters = {
  complementary_services_types: {
    id: string
    name: string
  }[]
  travel_experiences: {
    id: string
    name: string
  }[]
  regions: {
    id: string
    name: string
  }[]
  transportation_types: {
    id: string
    name: string
  }[]
}
