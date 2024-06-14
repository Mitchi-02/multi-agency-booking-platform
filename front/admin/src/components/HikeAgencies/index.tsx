"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { HikeAgency } from "@/api/hike_agency/types"

import { toast } from "react-toastify"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { TravelAgency } from "@/api/travel_agency/types"
import { deleteHikeAgency } from "@/api/hike_agency"
import queryClient from "@/lib/queryClient"
import Link from "next/link"

export type Agency = {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: string
}

const ActionsCell = ({ row }: { row: Row<TravelAgency> }) => {
  const DeleteAgencyMutation = {
    mutationFn: deleteHikeAgency,
    onSuccess: () => {
      toast.success(`${row.original.name} deleted successfully`)
      queryClient.invalidateQueries({
        queryKey: ["hike-agencies"]
      })
      queryClient.invalidateQueries({
        queryKey: ["hikeAgencyDetails", row.original._id]
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
        href={`/hiking-agencies/${row.original._id}`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View hike agency details"
      >
        <span className="sr-only">View hike agency details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Delete agency</span>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete {row.original.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this agency.
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

export const columns: ColumnDef<TravelAgency>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "contact_email",
    header: "Email"
  },
  {
    accessorKey: "phone",
    header: "Phone"
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionsCell
  }
]

export function HikeAgencies({ pageSize, data }: { pageSize: number; data: HikeAgency[] }) {
  return (
    <div className="w-full">
      <DataTable pageSize={pageSize} data={data} columns={columns} searchKey="name" placeholder="Search by name..." />
    </div>
  )
}
