import guestApi from "@/lib/guest.api"
import { PaginationResponse, SearchHikesQuery, SuccessResponse } from "../types"
import { Hike, HikeDetails, HikeSuggestion } from "./types"
import { DURATIONS } from "@/lib/constants/hikes"

export const paginateHikes = async (query: SearchHikesQuery) => {
  const params: Record<string, any> = {
    ...query
  }
  const d = DURATIONS.filter((d) => query.durations?.includes(d.id))
    .map((d) => `${d.min_duration ?? ""}_${d.max_duration ?? ""}`)
    .join("-")
  if (d) {
    params.durations = d
  }
  const response = await guestApi.get<any, SuccessResponse<PaginationResponse<Hike>>>(`/ms-hikes/hike/public`, {
    params
  })
  return response.data.data
}

export const getHikeDetails = (id: string) => {
  return guestApi.get<any, SuccessResponse<HikeDetails>>(`/ms-hikes/hike/public/${id}`).then((res) => res.data.data)
}

export const getHikeSuggestions = (id: string, exclude?: string) => {
  return guestApi
    .get<any, SuccessResponse<HikeSuggestion[]>>(`/ms-hikes/hike/public/suggest/${id}?exclude=${exclude ?? ""}`)
    .then((res) => res.data.data)
}
