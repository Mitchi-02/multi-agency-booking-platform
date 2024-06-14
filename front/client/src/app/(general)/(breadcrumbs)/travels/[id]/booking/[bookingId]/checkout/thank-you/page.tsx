import { getTravelDetails } from "@/api/travel"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import { getTravelBookingById } from "@/api/booking/travel_booking"
import TravelThankYou from "@/components/thank-you/travel_thank"

export default async function TravelBookingThankPage({
  params: { id, bookingId }
}: {
  params: { id: string; bookingId: string }
}) {
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["travelDetails", id],
      queryFn: () => getTravelDetails(id)
    }),
    queryClient.prefetchQuery({
      queryKey: ["travelBookingDetails", bookingId],
      queryFn: () => getTravelBookingById(bookingId)
    })
  ])

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravelThankYou id={id} bookingId={bookingId} />
      </HydrationBoundary>
    </main>
  )
}
