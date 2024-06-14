import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import HikeThankYou from "@/components/thank-you/hike_thank"
import { getHikeBookingById } from "@/api/booking/hike_booking"
import { getHikeDetails } from "@/api/hike"

export default async function HikeBookingThankPage({
  params: { id, bookingId }
}: {
  params: { id: string; bookingId: string }
}) {
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["hikeDetails", id],
      queryFn: () => getHikeDetails(id)
    }),
    queryClient.prefetchQuery({
      queryKey: ["hikeBookingDetails", bookingId],
      queryFn: () => getHikeBookingById(bookingId)
    })
  ])

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HikeThankYou id={id} bookingId={bookingId} />
      </HydrationBoundary>
    </main>
  )
}
