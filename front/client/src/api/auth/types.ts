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
