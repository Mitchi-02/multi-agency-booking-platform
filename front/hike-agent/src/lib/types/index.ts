import { BaseFilter } from "@/api/types"
import { IconType } from "react-icons/lib"

export interface SideNavItem {
  title: string
  icon?: IconType
  link: string
  hasChildren?: boolean
  children?: SideNavItem[]
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
