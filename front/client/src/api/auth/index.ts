import apiInstance from "@/lib/api"
import guestApi from "@/lib/guest.api"
import {
  ChangePasswordSchemaType,
  ForgotPasswordSchemaType,
  LoginSchemaType,
  ProfilePictureType,
  ProfileSchemaType,
  SignUpSchemaType,
  ValidationSchemaType
} from "@/lib/types/user"

export async function login(user: LoginSchemaType) {
  const { data } = await guestApi.post("/ms-users/auth/login", user)
  return data
}

export async function register(user: SignUpSchemaType) {
  const formData = new FormData()
  for (const key in user) {
    formData.append(key, user[key as keyof SignUpSchemaType])
  }
  const { data } = await guestApi.post("/ms-users/auth/register", formData)
  return data
}

export async function updateUser(user: ProfileSchemaType | ProfilePictureType) {
  const formData = new FormData()
  Object.entries(user).forEach(([key, value]) => {
    if (typeof value === "string" || value instanceof Blob) {
      formData.append(key, value)
    }
  })
  const { data } = await apiInstance.patch("/ms-users/user/infos", formData)
  return data
}

export function sendResetPasswordEmail(data: ForgotPasswordSchemaType) {
  return guestApi.post("/ms-users/password/send", data)
}

export function resetPassword(data: ChangePasswordSchemaType & ForgotPasswordSchemaType) {
  return guestApi.post("/ms-users/password/reset", data)
}

export function verifyEmail(data: ValidationSchemaType) {
  return apiInstance.post("/ms-users/email/verify", data)
}

export function resendEmailVerification() {
  return apiInstance.post("/ms-users/email/resend")
}
