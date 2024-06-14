import { IAgency, IUser } from "@/api/auth/types"

export interface SessionData {
  accessToken?: string
  user?: IUser
  expires?: string
  agency?: IAgency
}
