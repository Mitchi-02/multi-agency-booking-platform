import { SuccessResponse } from "../../types"
import apiInstance from "@/lib/api"
import { HikeReview, HikeReviewPost } from "./types"
import guestApi from "@/lib/guest.api"

export const getHikeReviews = (hike_id: string) => {
  return guestApi
    .get<any, SuccessResponse<HikeReview[]>>(`/ms-hikes-query/reviews/public/top-three/${hike_id}`)
    .then((res) => res.data.data)
}

export const getHikeBookingReview = (booking_id: string) => {
  return apiInstance
    .get<any, SuccessResponse<HikeReview>>(`/ms-hikes/reviews/auth/${booking_id}`)
    .then((res) => res.data.data)
}

export const createHikeBookingReview = (data: HikeReviewPost) => {
  return apiInstance.post<any, SuccessResponse<HikeReview>>(`/ms-hikes/reviews/auth`, data)
}
