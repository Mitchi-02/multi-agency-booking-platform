import { getTravelDetails } from "@/api/travel"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import ExistingTravelBooking from "@/components/booking/existing_travel_booking"
import { getTravelBookingById } from "@/api/booking/travel_booking"

export default async function TravelBookingPage({
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
        <ExistingTravelBooking bookingId={bookingId} id={id} />
      </HydrationBoundary>
    </main>
  )
}
