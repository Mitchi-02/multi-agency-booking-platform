import apiInstance from "@/lib/api"
import { PaginationResponse, SuccessResponse } from "../types"
import { User } from "./types"
import { AddUserSchemaType } from "@/lib/types/user"

export const paginateUsers = async () => {
  const response = await apiInstance.get<any, SuccessResponse<PaginationResponse<User>>>(
    `/ms-users/user/admin?&page=1&page_size=200`
  )
  return response.data.data
}

export const getSingleUser = async (userId: string) => {
  const response = await apiInstance.get<any, SuccessResponse<User>>(`/ms-users/user/admin/${userId}`)
  return response.data.data
}

export const deleteUser = async (userId: number) => {
  const response = await apiInstance.delete<any, SuccessResponse<User>>(`/ms-users/user/admin/${userId}`)
  return response.data.data
}

export const createUser = async (user: AddUserSchemaType) => {
  const response = await apiInstance.post<any, SuccessResponse<User>>(`/ms-users/user/admin`, user)
  return response.data.data
}
