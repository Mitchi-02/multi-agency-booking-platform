"use server"

import { createPaymentSecret } from "@/api/booking/hike_booking"

export const createPaymentIntentSecret = async (id: string) => {
  try {
    return await createPaymentSecret(id)
  } catch (error) {
    return null
  }
}
