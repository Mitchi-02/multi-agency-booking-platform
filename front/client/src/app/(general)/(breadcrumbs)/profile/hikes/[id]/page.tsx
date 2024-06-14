import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import HikeBooking from "@/components/bookings/HikeBooking"
import { getHikeBookingById } from "@/api/booking/hike_booking"
import { getHikeBookingReview } from "@/api/review/hike_review"

export default async function TravelBookingThankPage({ params: { id } }: { params: { id: string } }) {
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["hikeBookingDetails", id],
      queryFn: () => getHikeBookingById(id)
    }),
    queryClient.prefetchQuery({
      queryKey: ["hikeBookingReview", id],
      queryFn: () => getHikeBookingReview(id)
    })
  ])

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HikeBooking id={id} />
      </HydrationBoundary>
    </main>
  )
}
