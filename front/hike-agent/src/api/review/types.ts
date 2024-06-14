export type HikeReview = {
  _id: string
  user: HikeUser
  booking: string
  agency: string
  hike: string
  rating: number
  createdAt: string
  comment: string
}

export type HikeUser = {
  id: number
  first_name: string
  last_name: string
  address: string
  profile_picture: string
  reviews_count: number
}
