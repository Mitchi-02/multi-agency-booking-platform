import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import { BookingFormData } from "@/lib/types/booking"
import { getHikeDetails } from "@/api/hike"
import HikeBooking from "@/components/booking/hike_booking"

export default async function HikeBookingPage({
  searchParams,
  params: { id }
}: {
  searchParams: {
    kids?: string
    adults?: string
    services?: string
  }
  params: { id: string }
}) {
  const queryClient = getQueryClient()
  const query: BookingFormData = {
    kids: searchParams.kids ? Number(searchParams.kids) : 0,
    adults: searchParams.adults ? Number(searchParams.adults) : 1,
    services: searchParams.services ? searchParams.services.split("_") : []
  }

  await queryClient.prefetchQuery({
    queryKey: ["hikeDetails", id],
    queryFn: () => getHikeDetails(id)
  })

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HikeBooking booking={query} id={id} />
      </HydrationBoundary>
    </main>
  )
}
