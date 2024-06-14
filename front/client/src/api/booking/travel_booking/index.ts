import { PaginationResponse, SearchBookingsQuery, SuccessResponse } from "../../types"
import { SingleBookingPost } from "../types"
import { CompleteTravelBooking, ListTravelBooking, TravelPayment } from "./types"
import apiInstance from "@/lib/api"

export const bookTravel = (id: string, bookings: SingleBookingPost[]) => {
  return apiInstance.post<any, SuccessResponse<CompleteTravelBooking>>(`/ms-travels/booking/auth`, {
    travel: id,
    bookers: bookings
  })
}

export const updateBookTravel = (id: string, bookings: SingleBookingPost[]) => {
  return apiInstance.put<any, SuccessResponse<CompleteTravelBooking>>(`/ms-travels/booking/auth/${id}`, {
    travel: id,
    bookers: bookings
  })
}

export const deleteBookingById = (id: string) => {
  return apiInstance.delete<any, SuccessResponse<CompleteTravelBooking>>(`/ms-travels/booking/auth/${id}`)
}

export const payBookingCash = (id: string) => {
  return apiInstance.post<any, SuccessResponse<null>>(`/ms-payment/travel_payment/auth/cash/${id}`)
}

export const createPaymentSecret = (id: string) => {
  return apiInstance
    .post<any, SuccessResponse<TravelPayment>>(`/ms-payment/travel_payment/auth/${id}`)
    .then((res) => res.data.data)
}

export const paginateTravelBookings = async (query: SearchBookingsQuery) => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<ListTravelBooking>>>(
    `/ms-travels/booking/auth`,
    {
      params: query
    }
  )
  return response.data.data
}

export const getTravelBookingById = (id: string) => {
  return apiInstance
    .get<any, SuccessResponse<CompleteTravelBooking>>(`/ms-travels/booking/auth/${id}`)
    .then((res) => res.data.data)
}