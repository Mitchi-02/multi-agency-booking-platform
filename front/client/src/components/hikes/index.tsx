"use client"

import { paginateHikes } from "@/api/hike"
import { SearchHikesQuery } from "@/api/types"
import usePagination from "@/lib/hooks/usePagination"
import { memo } from "react"
import SearchInput from "../global/booking/Filters/SearchInput"
import PriceRange from "../global/booking/Filters/PriceRange"
import MultiSelectFilter from "../global/booking/Filters/MultiSelectFilter"
import { Separator } from "../ui/separator"
import HikeCard from "./HikeCard"
import { useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { DURATIONS } from "@/lib/constants/hikes"
import NotFound from "../global/NotFound"

interface HikesProps extends React.HTMLAttributes<HTMLElement> {
  initParams?: SearchHikesQuery
}

const Hikes = memo(function HikesMemo({ initParams }: HikesProps) {
  const {
    query,
    data,
    debounceSingleQuery,
    isLoading,
    isDebounceLoading,
    debounceQuery,
    pagination: { canNext, setPage, count }
  } = usePagination({
    fetchMethod: paginateHikes,
    queryKey: "hikes",
    initialQuery: initParams
  })

  const params = useSearchParams()

  return (
    <section className="page-container flex gap-6 py-16 font-dm-sans">
      <aside className="min-w-fit basis-[18rem]">
        <SearchInput
          label="Search location or agency"
          placeholder="Agency..."
          id="search-hikes"
          value={query.search}
          onSearch={(s) => {
            debounceSingleQuery(2000, "search", s || undefined)
          }}
          isLoading={isDebounceLoading}
        />
        <Separator className="mx-3 my-5 w-auto rounded-lg" />
        <PriceRange
          label="Price Range"
          id="price-range"
          min_value={query.price_min}
          max_value={query.price_max}
          onUpdate={(values) => {
            debounceQuery(3000, {
              ...query,
              price_min: values[0] === undefined ? undefined : `${values[0]}`,
              price_max: values[1] === undefined ? undefined : `${values[1]}`
            })
          }}
          isLoading={isDebounceLoading}
        />
        <Separator className="mx-3 my-5 w-auto rounded-lg" />
        <MultiSelectFilter
          accessor="id"
          data={DURATIONS}
          label="Duration"
          isLoading={isDebounceLoading}
          onUpdate={(d) => {
            debounceSingleQuery(2000, "durations", d)
          }}
          durations={query.durations}
        />
      </aside>
      <section className="grow">
        <ul className="grid grid-cols-2 gap-4">
          {data.map((hike) => {
            return (
              <li key={hike._id}>
                <HikeCard
                  link={`/hikes/${hike._id}?kids=${params.get("kids") ? Number(params.get("kids")) : 0}&adults=${params.get("adults") ? Number(params.get("adults")) : 1}`}
                  hike={hike}
                  kids={params.get("kids") ? Number(params.get("kids")) : 0}
                  adults={params.get("adults") ? Number(params.get("adults")) : 1}
                />
              </li>
            )
          })}
        </ul>
        <div className="flex justify-center pt-14">
          {count > 0 ? (
            <Button
              variant={"secondary"}
              className="h-auto gap-3 rounded-3xl bg-transparent px-10 py-3 text-base font-medium ring-[1px] ring-light-gray"
              onClick={() => {
                setPage((p) => p + 1, true)
              }}
              disabled={isLoading || isDebounceLoading || !canNext}
            >
              {isLoading && <Spinner />}
              View More
            </Button>
          ) : (
            <NotFound />
          )}
        </div>
      </section>
    </section>
  )
})

export default Hikes
