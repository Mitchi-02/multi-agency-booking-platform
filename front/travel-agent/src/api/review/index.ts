import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { TravelReview } from "./types"

export async function getReview(booking_id: string) {
  return apiInstance
    .get<any, SuccessResponse<TravelReview>>(`/ms-travels-query/reviews/agent/${booking_id}`)
    .then((res) => res.data.data)
}

export async function getReviews() {
  return apiInstance
    .get<any, SuccessResponse<PaginationResponse<TravelReview>>>(`/ms-travels-query/reviews/agent?page_size=1000`)
    .then((res) => res.data.data)
}

export async function getReviewsByTravel(travel_id: string) {
  return apiInstance
    .get<
      any,
      SuccessResponse<PaginationResponse<TravelReview>>
    >(`/ms-travels-query/reviews/agent/travel/${travel_id}?page_size=1000`)
    .then((res) => res.data.data)
}
