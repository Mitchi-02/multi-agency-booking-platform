import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { HikeReview } from "./types"

export async function getReview(booking_id: string) {
  return apiInstance
    .get<any, SuccessResponse<HikeReview>>(`/ms-hikes-query/reviews/agent/${booking_id}`)
    .then((res) => res.data.data)
}

export async function getReviews() {
  return apiInstance
    .get<any, SuccessResponse<PaginationResponse<HikeReview>>>(`/ms-hikes-query/reviews/agent?page_size=1000`)
    .then((res) => res.data.data)
}

export async function getReviewsByHike(hike_id: string) {
  return apiInstance
    .get<
      any,
      SuccessResponse<PaginationResponse<HikeReview>>
    >(`/ms-hikes-query/reviews/agent/hike/${hike_id}?page_size=1000`)
    .then((res) => res.data.data)
}
