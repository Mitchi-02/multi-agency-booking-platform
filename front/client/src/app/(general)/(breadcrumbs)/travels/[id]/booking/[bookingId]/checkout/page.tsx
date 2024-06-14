import { getTravelDetails } from "@/api/travel"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import { getTravelBookingById } from "@/api/booking/travel_booking"
import TravelBookingCheckout from "@/components/checkout/travel_checkout"
import { createPaymentIntentSecret } from "@/actions/travels"
import { notFound } from "next/navigation"
import { PaymentMethod } from "@/api/booking/types"

export default async function TravelBookingCheckoutPage({
  params: { id, bookingId }
}: {
  params: { id: string; bookingId: string }
}) {
  const queryClient = getQueryClient()

  const [payment] = await Promise.all([
    createPaymentIntentSecret(bookingId),
    queryClient.prefetchQuery({
      queryKey: ["travelDetails", id],
      queryFn: () => getTravelDetails(id)
    }),
    queryClient.prefetchQuery({
      queryKey: ["travelBookingDetails", bookingId],
      queryFn: () => getTravelBookingById(bookingId)
    })
  ])

  if (!payment || payment.paid || payment.method === PaymentMethod.CASH) {
    notFound()
  }

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravelBookingCheckout payment={payment} id={id} bookingId={bookingId} />
      </HydrationBoundary>
    </main>
  )
}
