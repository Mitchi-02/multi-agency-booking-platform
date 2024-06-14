import { paginateHikes } from "@/api/hike"
import SearchForm from "@/components/global/booking/SearchForm"
import Hikes from "@/components/hikes"
import getQueryClient from "@/lib/query.server"
import { HikeSearchData } from "@/lib/types"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { emptyParam } from "@/lib/utils"
import { SearchHikesQuery } from "@/api/types"
import { DURATIONS } from "@/lib/constants/hikes"

export default async function HikesPage({ searchParams }: { searchParams: HikeSearchData }) {
  const queryClient = getQueryClient()
  const query: SearchHikesQuery = {
    ...emptyParam({
      price_max: searchParams.price_max,
      search: searchParams.search,
      price_min: searchParams.price_min,
      destination: searchParams.destination,
      durations: !searchParams.durations
        ? undefined
        : DURATIONS.filter((d) => searchParams.durations?.includes(d.id)).map((d) => d.id),
      departure_date: searchParams.departure_date,
      return_date: searchParams.return_date,
      page_size: searchParams.page_size ? Number(searchParams.page_size) : undefined,
      page: searchParams.page ? Number(searchParams.page) : 1
    })
  }

  await queryClient.prefetchQuery({
    queryKey: ["hikes", query],
    queryFn: () => paginateHikes(query)
  })

  return (
    <main className="pt-16">
      <section>
        <SearchForm page="hike" />
      </section>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hikes initParams={query} />
      </HydrationBoundary>
    </main>
  )
}
