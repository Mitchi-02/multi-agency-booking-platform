import { BaseFilter } from "../types"

export type Travel = {
  _id: string
  travel_agency: {
    _id: string
    name: string
    rating: string
    reviews_count: number
  }
  title: string
  description: string
  hotel: string
  departure_date: string
  return_date: string
  departure_place: string
  duration: number //in days
  destination: string
  adult_price: number
  kid_price: number
  places_left: number
  complementary_services: {
    name: string
    type: string
  }[]
  photos: string[]
  region: string
  transportation_type: string
  experiences: string[]
}

export type TravelFilters = {
  travel_experiences: BaseFilter[]
  regions: BaseFilter[]
  transportation_types: BaseFilter[]
  complementary_services_types: BaseFilter[]
}


export type TravelComplementaryService = {
  name: string
  price: number
  type: string
}

export type TravelPlanStep = {
  title: string
  description: string
}

export type TravelDetails = {
  _id: string
  travel_agency: {
    _id: string
    name: string
    address: string
    logo: string
    photos: string[]
    rating: number
    reviews_count: number
  }
  title: string
  hotel: string
  description: string
  departure_date: string
  return_date: string
  departure_place: string
  duration: number //in days
  destination: string
  adult_price: number
  kid_price: number
  total_limit: number
  places_left: number
  photos: string[]
  complementary_services: TravelComplementaryService[]
  plan: TravelPlanStep[]
  createdAt: string
  updatedAt: string
  region: string
  transportation_type: string
  experiences: string[]
}

export type TravelSuggestion = {
  _id: string
  travel_agency: {
    _id: string
    rating: number
    reviews_count: number
  }
  title: string
  destination: string
  photos: string[]
}