import { getTravelDetails } from "@/api/travel"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/query.server"
import TravelBooking from "@/components/booking/travel_booking"
import { BookingFormData } from "@/lib/types/booking"

export default async function TravelBookingPage({
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
    queryKey: ["travelDetails", id],
    queryFn: () => getTravelDetails(id)
  })

  return (
    <main className="pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravelBooking booking={query} id={id} />
      </HydrationBoundary>
    </main>
  )
}
