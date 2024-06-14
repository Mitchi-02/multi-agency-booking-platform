import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { HikeAgency } from "./types"
import { AddHikingAgencySchemaType, UpdateHikeAgencySchemaType } from "@/lib/types/agency"

export const paginateHikeAgencies = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<HikeAgency>>>(
    `/ms-hikes/agency/admin?page_size=100`
  )
  return response.data.data
}

export const getHikeAgencyDetails = async (id: string) => {
  const response = await apiInstance.get<any, SuccessResponse<HikeAgency>>(`/ms-hikes/agency/admin/${id}`)
  return response.data.data
}

export async function createHikeAgency(agency: AddHikingAgencySchemaType) {
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

  const { data } = await apiInstance.post(`/ms-hikes/agency/admin`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}

export async function updateHikeAgency(agency: UpdateHikeAgencySchemaType, id: string) {
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

  const { data } = await apiInstance.put(`/ms-hikes/agency/admin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}

export const deleteHikeAgency = async (agencyId: string) => {
  const response = await apiInstance.delete<any, SuccessResponse<HikeAgency>>(`/ms-hikes/agency/admin/${agencyId}`)
  return response.data
}
