import guestApi from "@/lib/guest.api"
import { PaginationResponse, SearchTravelsQuery, SuccessResponse } from "../types"
import { Travel, TravelDetails, TravelSuggestion } from "./types"
import { DURATIONS } from "@/lib/constants/travels"

export const paginateTravels = async (query: SearchTravelsQuery) => {
  const params: Record<string, any> = {
    ...query
  }
  const d = DURATIONS.filter((d) => query.durations?.includes(d.id))
    .map((d) => `${d.min_duration ?? ""}_${d.max_duration ?? ""}`)
    .join("-")
  if (d) {
    params.durations = d
  }

  if (query.travel_experiences) {
    params.travel_experiences = query.travel_experiences.join("_")
  }
  if (query.regions) {
    params.regions = query.regions.join("_")
  }
  if (query.transportation_types) {
    params.transportation_types = query.transportation_types.join("_")
  }

  const response = await guestApi.get<any, SuccessResponse<PaginationResponse<Travel>>>(`/ms-travels/travel/public`, {
    params
  })
  return response.data.data
}

export const getTravelDetails = (id: string) => {
  return guestApi
    .get<any, SuccessResponse<TravelDetails>>(`/ms-travels/travel/public/${id}`)
    .then((res) => res.data.data)
}

export const getTravelSuggestions = (id: string, exclude?: string) => {
  return guestApi
    .get<any, SuccessResponse<TravelSuggestion[]>>(`/ms-travels/travel/public/suggest/${id}?exclude=${exclude ?? ""}`)
    .then((res) => res.data.data)
}
