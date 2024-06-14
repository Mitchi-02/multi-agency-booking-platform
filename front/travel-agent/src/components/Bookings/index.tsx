"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/custom/data-table"
import { BookingUI } from "@/lib/types/travel"
import { useMutation } from "@tanstack/react-query"
import { deleteBooking } from "@/api/booking"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import Link from "next/link"
import { EyeIcon, Trash } from "lucide-react"
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
import Image from "next/image"
import { Booking } from "@/api/booking/types"
import { DateTime } from "luxon"
import { FaPlaneDeparture } from "react-icons/fa"
import DefaultPP from "@/assets/images/default_pp.png"

const UserCell = ({ row }: { row: Row<BookingUI> }) => {
  return (
    <div className="flex items-center justify-start gap-2">
      <Image src={row.original.user_photo ?? DefaultPP} width={40} height={40} alt="user" className="rounded-full" />
      <span className="text-sm font-medium capitalize">{row.original.user_name}</span>
    </div>
  )
}

const ActionsCell = ({ row }: { row: Row<BookingUI> }) => {
  const DeleteAgencyMutation = {
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success(`Booking deleted successfully`)
      queryClient.invalidateQueries({
        queryKey: ["bookings"]
      })
      queryClient.invalidateQueries({
        queryKey: ["bookingDetails", row.original._id]
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
        href={`/bookings/${row.original._id}`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View booking details"
      >
        <span className="sr-only">View booking details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      <Link
        href={`/travels/${row.original.travel_id}`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View travel details"
      >
        <span className="sr-only">View travel details</span>
        <FaPlaneDeparture className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="">
            <span className="sr-only">Delete booking</span>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this booking.
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

export const columns: ColumnDef<BookingUI>[] = [
  {
    id: "user",
    header: "User",
    enableHiding: false,
    cell: UserCell
  },
  {
    accessorKey: "travel_destination",
    header: "Destination"
  },
  {
    accessorKey: "travel_departure_date",
    header: "Departure Date"
  },
  {
    accessorKey: "total",
    header: "Total"
  },
  {
    accessorKey: "price",
    header: "Price"
  },
  {
    accessorKey: "paid",
    header: "Paid"
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell
  }
]

export function Bookings({ pageSize, data }: { pageSize: number; data: Booking[] }) {
  return (
    <div className="w-full">
      <DataTable
        pageSize={pageSize}
        data={data.map((d) => ({
          _id: d._id,
          travel_id: d.travel._id,
          method: d.method,
          updatedAt: DateTime.fromISO(d.updatedAt).toFormat("LLL dd yyyy HH:mm"),
          price: d.price,
          total: d.booking_items.length,
          travel_departure_date: DateTime.fromISO(d.travel.departure_date).toFormat("LLL dd yyyy HH:mm"),
          travel_destination: d.travel.destination,
          paid: d.paid ? "Paid" : "Not Payed",
          user_photo: d.user.profile_picture,
          user_name: `${d.user.first_name} ${d.user.last_name}`
        }))}
        placeholder="Search by destination..."
        searchKey="travel_destination"
        //@ts-ignore
        columns={columns}
        filter={{
          data: [
            { value: "Paid", label: "Paid" },
            { value: "Not Payed", label: "Not Paid" }
          ],
          key: "paid"
        }}
      />
    </div>
  )
}
