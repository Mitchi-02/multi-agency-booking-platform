export interface IUser {
  id: number
  first_name: string | null
  last_name: string | null
  email: string
  address: string | null
  phone: string | null
  profile_picture: string | null
  birth_date: string | null
  gender: string | null
  verified: boolean
  role: string
  organization_id: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export interface IAgency {
  _id: string
  name: string
  description: string
  address: string
  phone: string
  contact_email: string
  logo: string
  photos: [string]
  social_media: Record<string, string>
  rating: number
  is_complete: boolean
  reviews_count: number
  createdAt: string
  updatedAt: string
}
