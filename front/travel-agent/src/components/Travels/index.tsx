"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { Travel } from "@/api/travel/types"
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
import { deleteTravel } from "@/api/travel"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import Link from "next/link"
import { EyeIcon, Star, Ticket, Trash } from "lucide-react"

const ActionsCell = ({ row }: { row: Row<Travel> }) => {
  const DeleteAgencyMutation = {
    mutationFn: deleteTravel,
    onSuccess: () => {
      toast.success(`Booking deleted successfully`)
      queryClient.invalidateQueries({
        queryKey: ["travels"]
      })
      queryClient.invalidateQueries({
        queryKey: ["travelDetails", row.original._id]
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
      <Link href={`/travels/${row.original._id}`} className="rounded-md px-4 py-2  hover:bg-gray-100" title="View travel details">
        <span className="sr-only">View travel details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      <Link href={`/travels/${row.original._id}/bookings`} className="rounded-md px-4 py-2  hover:bg-gray-100" title="View travel bookings">
        <span className="sr-only">View travel bookings</span>
        <Ticket className="h-4 w-4" />
      </Link>
      <Link href={`/travels/${row.original._id}/reviews`} className="rounded-md px-4 py-2  hover:bg-gray-100" title="View travel reviews">
        <span className="sr-only">View travel reviews</span>
        <Star className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="">
            <span className="sr-only">Delete travel</span>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete this travel?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this travel.
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

export const columns: ColumnDef<Travel>[] = [
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

export default function Travels({ pageSize, data }: { pageSize: number; data: Travel[] }) {
  return (
    <div className="w-full">
      <DataTable
        placeholder="Filter by destination"
        searchKey="destination"
        pageSize={pageSize}
        data={data.map((d) => ({
          ...d,
          departure_date: DateTime.fromISO(d.departure_date).toFormat("LLL dd yyyy HH:mm"),
          return_date: DateTime.fromISO(d.return_date).toFormat("LLL dd yyyy HH:mm")
        }))}
        columns={columns}
      />
    </div>
  )
}
