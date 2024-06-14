export type Hike = {
  _id: string
  hike_agency: {
    _id: string
    name: string
    rating: string
    reviews_count: number
  }
  title: string
  description: string
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
}

export type HikeComplementaryService = {
  name: string
  price: number
  type: string
}

export type HikePlanStep = {
  title: string
  description: string
}

export type HikeDetails = {
  _id: string
  hike_agency: {
    _id: string
    name: string
    address: string
    logo: string
    photos: string[]
    rating: number
    reviews_count: number
  }
  title: string
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
  complementary_services: HikeComplementaryService[]
  plan: HikePlanStep[]
  createdAt: string
  updatedAt: string
}

export type HikeSuggestion = {
  _id: string
  hike_agency: {
    _id: string
    rating: number
    reviews_count: number
  }
  title: string
  destination: string
  photos: string[]
}
