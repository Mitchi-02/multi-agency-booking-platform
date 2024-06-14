"use server"

import { TravelFilters } from "@/api/travel/types"
import { createPaymentSecret } from "@/api/booking/travel_booking"
import { SERVER_URL } from "@/lib/constants"

export const getFilters = async () => {
  const response = await fetch(`${SERVER_URL}/ms-travels/travel/public/filters`, {
    cache: "force-cache"
  })
  const data = await response.json()
  return data.data as TravelFilters
}

export const createPaymentIntentSecret = async (id: string) => {
  try {
    return await createPaymentSecret(id)
  } catch (error) {
    return null
  }
}
