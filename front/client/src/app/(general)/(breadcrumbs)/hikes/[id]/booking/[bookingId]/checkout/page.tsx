import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import { getHikeBookingById } from "@/api/booking/hike_booking"
import HikeBookingCheckout from "@/components/checkout/hike_checkout"
import { createPaymentIntentSecret } from "@/actions/hikes"
import { notFound } from "next/navigation"
import { PaymentMethod } from "@/api/booking/types"
import { getHikeDetails } from "@/api/hike"

export default async function HikeBookingCheckoutPage({
  params: { id, bookingId }
}: {
  params: { id: string; bookingId: string }
}) {
  const queryClient = getQueryClient()

  const [payment] = await Promise.all([
    createPaymentIntentSecret(bookingId),
    queryClient.prefetchQuery({
      queryKey: ["hikeDetails", id],
      queryFn: () => getHikeDetails(id)
    }),
    queryClient.prefetchQuery({
      queryKey: ["hikeBookingDetails", bookingId],
      queryFn: () => getHikeBookingById(bookingId)
    })
  ])

  if (!payment || payment.paid || payment.method === PaymentMethod.CASH) {
    notFound()
  }

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HikeBookingCheckout payment={payment} id={id} bookingId={bookingId} />
      </HydrationBoundary>
    </main>
  )
}
