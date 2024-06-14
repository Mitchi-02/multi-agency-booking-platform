"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { FiPlus } from "react-icons/fi"
import Link from "next/link"
import usePagination from "@/lib/hooks/usePagination"
import Hikes from "@/components/Hikes"
import { paginateHikes } from "@/api/hike"

export default function HikesPage() {
  const {
    data,
    isLoading,
  } = usePagination({
    fetchMethod: paginateHikes,
    queryKey: "hikes"
  })

  return (
    <>
      <div className="flex justify-between">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-black leading-none tracking-tight">Hikes of your agency</h1>
          <h3 className="text-lg tracking-tight  text-gray-500">View all the current hikes details</h3>
        </div>
        <Link href={"/hikes/create"}>
          <Button size={"xl2"} variant={"primary"}>
            <FiPlus className="mr-1 h-6 w-6" />
            Add Hike
          </Button>
        </Link>
      </div>
      <div className="flex-1 space-y-4 pb-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Hikes</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              {isLoading ? (
                <div className="p-10 text-center text-xl font-medium">Loading...</div>
              ) : (
                <Hikes data={data} pageSize={10} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
