"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import usePagination from "@/lib/hooks/usePagination"
import { Bookings } from "@/components/Bookings"
import { paginateBookings } from "@/api/booking"


export default function BookingsPage() {
  const { data, isLoading } = usePagination({
    fetchMethod: paginateBookings,
    queryKey: "bookings"
  })

  return (
    <>
      <div className="flex justify-between">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-black leading-none tracking-tight">Travel bookings of your agency</h1>
          <h3 className="text-lg tracking-tight  text-gray-500">View all the current bookings</h3>
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
