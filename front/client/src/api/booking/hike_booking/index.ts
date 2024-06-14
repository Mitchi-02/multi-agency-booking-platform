import { PaginationResponse, SearchBookingsQuery, SuccessResponse } from "../../types"
import apiInstance from "@/lib/api"
import { SingleBookingPost } from "../types"
import { CompleteHikeBooking, HikePayment, ListHikeBooking } from "./types"

export const bookHike = (id: string, bookings: SingleBookingPost[]) => {
  return apiInstance.post<any, SuccessResponse<CompleteHikeBooking>>(`/ms-hikes/booking/auth`, {
    hike: id,
    bookers: bookings
  })
}

export const updateBookHike = (id: string, bookings: SingleBookingPost[]) => {
  return apiInstance.put<any, SuccessResponse<CompleteHikeBooking>>(`/ms-hikes/booking/auth/${id}`, {
    hike: id,
    bookers: bookings
  })
}

export const deleteBookingById = (id: string) => {
  return apiInstance.delete<any, SuccessResponse<CompleteHikeBooking>>(`/ms-hikes/booking/auth/${id}`)
}

export const payBookingCash = (id: string) => {
  return apiInstance.post<any, SuccessResponse<null>>(`/ms-payment/hike_payment/auth/cash/${id}`)
}

export const createPaymentSecret = (id: string) => {
  return apiInstance
    .post<any, SuccessResponse<HikePayment>>(`/ms-payment/hike_payment/auth/${id}`)
    .then((res) => res.data.data)
}

export const paginateHikeBookings = async (query: SearchBookingsQuery) => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<ListHikeBooking>>>(`/ms-hikes/booking/auth`, {
    params: query
  })
  return response.data.data
}

export const getHikeBookingById = (id: string) => {
  return apiInstance
    .get<any, SuccessResponse<CompleteHikeBooking>>(`/ms-hikes/booking/auth/${id}`)
    .then((res) => res.data.data)
}
