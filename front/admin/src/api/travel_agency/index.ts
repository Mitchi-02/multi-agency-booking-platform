import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { TravelAgency } from "./types"
import { AddTravelAgencySchemaType, UpdateTravelAgencySchemaType } from "@/lib/types/agency"

export const paginateTravelAgencies = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<TravelAgency>>>(
    `/ms-travels/agency/admin?page_size=100`
  )
  return response.data.data
}

export const getTravelAgencyDetails = async (id: string) => {
  const response = await apiInstance.get<any, SuccessResponse<TravelAgency>>(`/ms-travels/agency/admin/${id}`)
  return response.data.data
}

export async function createTravelAgency(agency: AddTravelAgencySchemaType) {
  const formData = new FormData()
  const { photos, logo, social_media, ...rest } = agency

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString())
    }
  })
  formData.append("social_media", JSON.stringify(social_media))
  if (logo) {
    formData.append("logo", logo)
  }
  if (photos && photos.length > 0) {
    photos.forEach((p) => {
      formData.append("photos[]", p)
    })
  }

  const { data } = await apiInstance.post(`/ms-travels/agency/admin`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}

export async function updateTravelAgency(agency: UpdateTravelAgencySchemaType, id: string) {
  const formData = new FormData()
  const { new_photos, deleted_photos, logo, social_media, ...rest } = agency

  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value.toString())
  })
  formData.append("social_media", JSON.stringify(social_media))
  if (typeof logo !== "string") {
    formData.append("logo", logo)
  }
  new_photos.forEach((p) => {
    formData.append("new_photos[]", p)
  })
  deleted_photos.forEach((p) => {
    formData.append("deleted_photos[]", p)
  })

  const { data } = await apiInstance.put(`/ms-travels/agency/admin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}

export const deleteTravelAgency = async (agencyId: string) => {
  const response = await apiInstance.delete<any, SuccessResponse<TravelAgency>>(`/ms-travels/agency/admin/${agencyId}`)
  return response.data
}
