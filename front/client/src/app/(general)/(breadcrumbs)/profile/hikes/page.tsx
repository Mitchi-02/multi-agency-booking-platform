import getQueryClient from "@/lib/query.server"
import { BookingSearchData } from "@/lib/types"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { emptyParam } from "@/lib/utils"
import { SearchBookingsQuery } from "@/api/types"
import { paginateHikeBookings } from "@/api/booking/hike_booking"
import HikeBookings from "@/components/bookings/HikeBookings"

export default async function HikeBookingsPage({ searchParams }: { searchParams: BookingSearchData }) {
  const queryClient = getQueryClient()
  const query: SearchBookingsQuery = {
    ...emptyParam({
      search: searchParams.search,
      page_size: searchParams.page_size ? Number(searchParams.page_size) : 12,
      page: searchParams.page ? Number(searchParams.page) : 1
    })
  }

  await queryClient.prefetchQuery({
    queryKey: ["hikeBookings", query],
    queryFn: () => paginateHikeBookings(query)
  })

  return (
    <main className="py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HikeBookings initParams={query} />
      </HydrationBoundary>
    </main>
  )
}
