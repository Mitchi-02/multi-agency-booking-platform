"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import usePagination from "@/lib/hooks/usePagination"
import { Bookings } from "@/components/Bookings"
import { useParams, useRouter } from "next/navigation"
import { paginateBookingsByTravel } from "@/api/booking"
import { getTravelDetails } from "@/api/travel"
import { CustomAxiosError } from "@/api/types"
import { TravelDetails } from "@/api/travel/types"
import { useQuery } from "@tanstack/react-query"
import Loading from "@/components/ui/custom/Loading"

export default function BookingsTravelPage() {
  const id = useParams<{ id: string }>().id
  const router = useRouter()

  const {
    error: errorTravel,
    data: travel,
    isFetching: isFetchingTravel
  } = useQuery<any, CustomAxiosError, TravelDetails>({
    queryKey: ["travelDetails", id],
    queryFn: () => getTravelDetails(id)
  })

  const { data, isLoading, isError } = usePagination({
    fetchMethod: () => paginateBookingsByTravel(id),
    queryKey: `bookings-${id}`
  })

  if (isFetchingTravel) return <Loading />

  if (isError || !travel || errorTravel?.response?.status === 404) {
    router.push("/404")
    return null
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-black leading-none tracking-tight">Bookings to {travel.destination}</h1>
          <h3 className="text-lg tracking-tight  text-gray-500">View all bookings of this travel</h3>
        </div>
      </div>
      <div className="flex-1 space-y-4 pb-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Travel bookings</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              {isLoading ? (
                <div className="p-10 text-center text-xl font-medium">Loading...</div>
              ) : (
                <Bookings data={data} pageSize={10} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
