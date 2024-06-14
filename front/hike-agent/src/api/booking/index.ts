import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { Booking, BookingDetails } from "./types"
import { UpdateBookingSchemaType } from "@/lib/types/hike"

export const paginateBookings = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<Booking>>>(
    `/ms-hikes-query/booking/agent?page_size=1000`
  )
  return response.data.data
}

export const paginateBookingsByHike = async (hike_id: string) => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<Booking>>>(
    `/ms-hikes-query/booking/agent/hike/${hike_id}?page_size=1000`
  )
  return response.data.data
}

export const getBookingById = (id: string) => {
  return apiInstance
    .get<any, SuccessResponse<Booking>>(`/ms-hikes-query/booking/agent/${id}`)
    .then((res) => res.data.data)
}

export const updateBooking = (booking: UpdateBookingSchemaType, id: string) => {
  return apiInstance
    .put<any, SuccessResponse<BookingDetails>>(`/ms-hikes/booking/agent/${id}`, booking)
    .then((res) => res.data)
}

export const deleteBooking = (id: string) => {
  return apiInstance.delete<any, SuccessResponse<Booking>>(`/ms-hikes/booking/agent/${id}`).then((res) => res.data)
}
