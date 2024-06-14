import { BaseFilter } from "@/api/types"

export type RouteType = {
  name: string
  regex: string
}

export interface SearchFormData {
  adults: number
  kids: number
  type: "travel" | "hike"
  destination?: string
  departure_date?: string
  return_date?: string
  open: boolean
}

export interface HikeSearchData extends Record<string, string | string[] | undefined> {
  page?: string
  page_size?: string
  search?: string
  durations?: string[]
  return_date?: string
  departure_date?: string
  adults?: string
  kids?: string
  destination?: string
  price_max?: string
  price_min?: string
}

export interface TravelSearchData extends Record<string, string | string[] | undefined> {
  page?: string
  page_size?: string
  search?: string
  durations?: string[]
  return_date?: string
  departure_date?: string
  adults?: string
  kids?: string
  destination?: string
  price_max?: string
  price_min?: string
}

export interface DurationFilter extends BaseFilter {
  min_duration?: string
  max_duration?: string
}

export interface BookingSearchData extends Record<string, string | string[] | undefined> {
  page?: string
  page_size?: string
  search?: string
}
