import { paginateTravels } from "@/api/travel"
import SearchForm from "@/components/global/booking/SearchForm"
import Travels from "@/components/travels"
import getQueryClient from "@/lib/query.server"
import { TravelSearchData } from "@/lib/types"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { emptyParam } from "@/lib/utils"
import { SearchTravelsQuery } from "@/api/types"
import { DURATIONS } from "@/lib/constants/travels"
import { getFilters } from "@/actions/travels"

export default async function TravelsPage({ searchParams }: { searchParams: TravelSearchData }) {
  const queryClient = getQueryClient()
  const filters = await getFilters()

  const query: SearchTravelsQuery = {
    ...emptyParam({
      price_max: searchParams.price_max,
      search: searchParams.search,
      price_min: searchParams.price_min,
      destination: searchParams.destination,
      durations: !searchParams.durations
        ? undefined
        : DURATIONS.filter((d) => searchParams.durations?.includes(d.id)).map((d) => d.id),
      travel_experiences: !searchParams.travel_experiences
        ? undefined
        : filters.travel_experiences
            .filter((d) => searchParams.travel_experiences?.includes(d.name))
            .map((d) => d.name),
      regions: !searchParams.regions
        ? undefined
        : filters.regions.filter((d) => searchParams.regions?.includes(d.name)).map((d) => d.name),
      transportation_types: !searchParams.transportation_types
        ? undefined
        : filters.transportation_types
            .filter((d) => searchParams.transportation_types?.includes(d.name))
            .map((d) => d.name),
      departure_date: searchParams.departure_date,
      return_date: searchParams.return_date,
      page_size: searchParams.page_size ? Number(searchParams.page_size) : 12,
      page: searchParams.page ? Number(searchParams.page) : 1
    })
  }

  await queryClient.prefetchQuery({
    queryKey: ["travels", query],
    queryFn: () => paginateTravels(query)
  })

  return (
    <main className="pt-16">
      <section>
        <SearchForm page="travel" />
      </section>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Travels initParams={query} filters={filters} />
      </HydrationBoundary>
    </main>
  )
}
