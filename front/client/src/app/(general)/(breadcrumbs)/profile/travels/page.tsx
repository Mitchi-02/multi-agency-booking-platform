import getQueryClient from "@/lib/query.server"
import { BookingSearchData } from "@/lib/types"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { emptyParam } from "@/lib/utils"
import { SearchBookingsQuery } from "@/api/types"
import { paginateTravelBookings } from "@/api/booking/travel_booking"
import TravelBookings from "@/components/bookings/TravelBookings"

export default async function TravelBookingsPage({ searchParams }: { searchParams: BookingSearchData }) {
  const queryClient = getQueryClient()
  const query: SearchBookingsQuery = {
    ...emptyParam({
      search: searchParams.search,
      page_size: searchParams.page_size ? Number(searchParams.page_size) : 12,
      page: searchParams.page ? Number(searchParams.page) : 1
    })
  }

  await queryClient.prefetchQuery({
    queryKey: ["travelBookings", query],
    queryFn: () => paginateTravelBookings(query)
  })

  return (
    <main className="py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravelBookings initParams={query} />
      </HydrationBoundary>
    </main>
  )
}
