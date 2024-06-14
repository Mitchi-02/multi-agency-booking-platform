import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import { getTravelBookingById } from "@/api/booking/travel_booking"
import TravelBooking from "@/components/bookings/TravelBooking"
import { getTravelBookingReview } from "@/api/review/travel_review"

export default async function TravelBookingThankPage({ params: { id } }: { params: { id: string } }) {
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["travelBookingDetails", id],
      queryFn: () => getTravelBookingById(id)
    }),
    queryClient.prefetchQuery({
      queryKey: ["travelBookingReview", id],
      queryFn: () => getTravelBookingReview(id)
    })
  ])

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravelBooking id={id} />
      </HydrationBoundary>
    </main>
  )
}
