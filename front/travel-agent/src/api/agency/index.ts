import apiInstance from "@/lib/api"
import { UpdateTravelAgencySchemaType } from "@/lib/types/agency"

export async function updateTravelAgency(agency: UpdateTravelAgencySchemaType) {
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

  const { data } = await apiInstance.put(`/ms-travels/agency/travel_agent`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}
