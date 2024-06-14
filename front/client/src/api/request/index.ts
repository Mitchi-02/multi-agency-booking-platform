import guestApi from "@/lib/guest.api"

export const requestAgency = (email: string) => {
  return guestApi.post(`/ms-requests/request/public`, {
    email
  })
}
