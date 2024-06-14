import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { Hike, HikeDetails, HikeFilters } from "./types"
import guestApi from "@/lib/guest.api"
import { CreateHikeSchemaType, UpdateHikeSchemaType } from "@/lib/types/hike"

export const paginateHikes = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<Hike>>>(
    `/ms-hikes/hike/hike_agent?page_size=100`
  )
  return response.data.data
}

export const getFilters = async () => {
  const response = await guestApi.get<any, SuccessResponse<HikeFilters>>(`/ms-hikes/hike/public/filters`)
  return response.data.data
}

export const getHikeDetails = async (id: string) => {
  const response = await apiInstance.get<any, SuccessResponse<HikeDetails>>(`/ms-hikes/hike/hike_agent/${id}`)
  return response.data.data
}

export const createHike = (data: CreateHikeSchemaType) => {
  const formData = new FormData()
  const { photos, complementary_services, plan, ...rest } = data
  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value.toString())
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
    .post<any, SuccessResponse<HikeDetails>>(`/ms-hikes/hike/hike_agent`, formData)
    .then((res) => res.data)
}

export const updateHike = (data: UpdateHikeSchemaType, id: string) => {
  const formData = new FormData()
  const { new_photos, deleted_photos, complementary_services, plan, ...rest } = data
  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value.toString())
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
    .patch<any, SuccessResponse<HikeDetails>>(`/ms-hikes/hike/hike_agent/${id}`, formData)
    .then((res) => res.data)
}

export const deleteHike = (id: string) => {
  return apiInstance
    .delete<any, SuccessResponse<HikeDetails>>(`/ms-hikes/hike/hike_agent/${id}`)
    .then((res) => res.data)
}
