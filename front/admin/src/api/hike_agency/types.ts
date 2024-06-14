export type HikeAgency = {
  _id: string
  name: string
  description: string
  address: string
  phone: string
  contact_email: string
  logo: string
  photos: string[]
  social_media: Record<string, unknown>
  rating: number
  is_complete: boolean
  reviews_count: number
  createdAt: string
  updatedAt: string
}
