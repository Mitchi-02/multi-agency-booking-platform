import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { AgencyRequest } from "./types"
import { UpdateRequestSchemaType } from "@/lib/types/agency"

export const pagianteRequests = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<AgencyRequest>>>(
    `/ms-requests/request?page_size=100`
  )
  return response.data.data
}

export const getRequestById = async (id: string) => {
  const response = await apiInstance.get<any, SuccessResponse<AgencyRequest>>(`/ms-requests/request/${id}`)
  return response.data.data
}

export const updateRequest = async (data: UpdateRequestSchemaType, id: string) => {
  const response = await apiInstance.patch<any, SuccessResponse<AgencyRequest>>(`/ms-requests/request/${id}`, data)
  return response.data
}

export const deleteRequest = async (id: string) => {
  const response = await apiInstance.delete<any, SuccessResponse<AgencyRequest>>(`/ms-requests/request/${id}`)
  return response.data
}
