import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { Travel, TravelDetails, TravelFilters } from "./types"
import { CreateTravelSchemaType, UpdateTravelSchemaType } from "@/lib/types/travel"
import guestApi from "@/lib/guest.api"

export const paginateTravels = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<Travel>>>(
    `/ms-travels/travel/travel_agent?page_size=100`
  )
  return response.data.data
}

export const getFilters = async () => {
  const response = await guestApi.get<any, SuccessResponse<TravelFilters>>(`/ms-travels/travel/public/filters`)
  return response.data.data
}

export const getTravelDetails = async (id: string) => {
  const response = await apiInstance.get<any, SuccessResponse<TravelDetails>>(`/ms-travels/travel/travel_agent/${id}`)
  return response.data.data
}

export const createTravel = (data: CreateTravelSchemaType) => {
  const formData = new FormData()
  const { photos, complementary_services, plan, experiences, ...rest } = data
  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value.toString())
  })
  experiences.forEach((e) => {
    formData.append("experiences[]", e)
  })
  photos.forEach((p) => {
    formData.append("photos[]", p)
  })
  plan.forEach((p) => {
    formData.append("plan[]", JSON.stringify(p))
  })
  complementary_services.forEach((s) => {
    formData.append("complementary_services[]", JSON.stringify(s))
  })
  return apiInstance
    .post<any, SuccessResponse<TravelDetails>>(`/ms-travels/travel/travel_agent`, formData)
    .then((res) => res.data)
}

export const updateTravel = (data: UpdateTravelSchemaType, id: string) => {
  const formData = new FormData()
  const { new_photos, deleted_photos, complementary_services, plan, experiences, ...rest } = data
  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value.toString())
  })
  experiences.forEach((e) => {
    formData.append("experiences[]", e)
  })
  new_photos.forEach((p) => {
    formData.append("new_photos[]", p)
  })
  deleted_photos.forEach((p) => {
    formData.append("deleted_photos[]", p)
  })
  plan.forEach((p) => {
    formData.append("plan[]", JSON.stringify(p))
  })
  complementary_services.forEach((s) => {
    formData.append("complementary_services[]", JSON.stringify(s))
  })
  return apiInstance
    .patch<any, SuccessResponse<TravelDetails>>(`/ms-travels/travel/travel_agent/${id}`, formData)
    .then((res) => res.data)
}

export const deleteTravel = (id: string) => {
  return apiInstance
    .delete<any, SuccessResponse<TravelDetails>>(`/ms-travels/travel/travel_agent/${id}`)
    .then((res) => res.data)
}
