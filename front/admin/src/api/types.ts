import { AxiosError, AxiosResponse } from "axios"

export type SuccessResponse<T> = AxiosResponse<{
  message: string
  data: T
}>

export interface CustomAxiosError extends AxiosError {
  response: AxiosResponse<{
    message: string
    errors: Record<string, string[]>
  }>
}

export interface PaginationResponse<T> {
  results: T[]
  count: number
  page: number
  page_size: number
}

export interface SearchHikesQuery extends PaginationQuery {
  destination?: string
  durations?: string[]
  return_date?: string
  departure_date?: string
  price_min?: string
  price_max?: string
}

export interface SearchTravelsQuery extends PaginationQuery {
  destination?: string
  durations?: string[]
  return_date?: string
  departure_date?: string
  price_min?: string
  price_max?: string
  travel_experiences?: string[]
  regions?: string[]
  transportation_types?: string[]
}

export interface PaginationQuery extends Record<string, any> {
  page: number
  page_size?: number
  search?: string
}

export interface BaseFilter {
  id: string
  name: string
  extra?: string | number
}
