export type TravelReview = {
  _id: string
  user: TravelUser
  booking: string
  agency: string
  travel: string
  rating: number
  createdAt: string
  comment: string
}

export type TravelReviewPost = {
  comment: string
  rating: number
  booking_id: string
}

export type TravelUser = {
  id: number
  first_name: string
  last_name: string
  address: string
  profile_picture: string
  reviews_count: number
}
