"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { Hike } from "@/api/hike/types"
import { DateTime } from "luxon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { deleteHike } from "@/api/hike"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import Link from "next/link"
import { EyeIcon, Star, Ticket, Trash } from "lucide-react"

const ActionsCell = ({ row }: { row: Row<Hike> }) => {
  const DeleteAgencyMutation = {
    mutationFn: deleteHike,
    onSuccess: () => {
      toast.success(`Booking deleted successfully`)
      queryClient.invalidateQueries({
        queryKey: ["hikes"]
      })
      queryClient.invalidateQueries({
        queryKey: ["hikeDetails", row.original._id]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(DeleteAgencyMutation)
  const handleDelete = async (id: string) => {
    mutation.mutate(id)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={`hikes/${row.original._id}`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View hike details"
      >
        <span className="sr-only">View hike details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      <Link
        href={`/hikes/${row.original._id}/bookings`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View hike bookings"
      >
        <span className="sr-only">View hike bookings</span>
        <Ticket className="h-4 w-4" />
      </Link>
      <Link
        href={`/hikes/${row.original._id}/reviews`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View hike reviews"
      >
        <span className="sr-only">View hike reviews</span>
        <Star className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="">
            <span className="sr-only">Delete hike</span>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete this hike?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this hike.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-900" onClick={() => handleDelete(row.original._id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const columns: ColumnDef<Hike>[] = [
  {
    accessorKey: "destination",
    header: "Destination"
  },
  {
    accessorKey: "departure_place",
    header: "Departure Place"
  },
  {
    accessorKey: "departure_date",
    header: "Departure Date"
  },
  {
    accessorKey: "return_date",
    header: "Return Date"
  },
  {
    accessorKey: "total_limit",
    header: "Total Limit"
  },
  {
    accessorKey: "places_left",
    header: "Places Left"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell
  }
]

export default function Hikes({ pageSize, data }: { pageSize: number; data: Hike[] }) {
  return (
    <div className="w-full">
      <DataTable
        placeholder="Filter by destination"
        searchKey="destination"
        pageSize={pageSize}
        data={data.map((d) => ({
          ...d,
          departure_date: DateTime.fromISO(d.departure_date).toFormat("LLL dd yyyy"),
          return_date: DateTime.fromISO(d.return_date).toFormat("LLL dd yyyy")
        }))}
        columns={columns}
      />
    </div>
  )
}
