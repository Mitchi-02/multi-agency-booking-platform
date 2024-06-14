import { SuccessResponse } from "../../types"
import apiInstance from "@/lib/api"
import { TravelReview, TravelReviewPost } from "./types"
import guestApi from "@/lib/guest.api"

export const getTravelReviews = (travel_id: string) => {
  return guestApi
    .get<any, SuccessResponse<TravelReview[]>>(`/ms-travels-query/reviews/public/top-three/${travel_id}`)
    .then((res) => res.data.data)
}

export const getTravelBookingReview = (booking_id: string) => {
  return apiInstance
    .get<any, SuccessResponse<TravelReview>>(`/ms-travels/reviews/auth/${booking_id}`)
    .then((res) => res.data.data)
}

export const createTravelBookingReview = (data: TravelReviewPost) => {
  return apiInstance.post<any, SuccessResponse<TravelReview>>(`/ms-travels/reviews/auth`, data)
}
