"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { TravelAgency } from "@/api/travel_agency/types"
import { useMutation } from "@tanstack/react-query"
import { deleteTravelAgency } from "@/api/travel_agency"
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
import { HikeAgency } from "@/api/hike_agency/types"
import queryClient from "@/lib/queryClient"
import Link from "next/link"

const ActionsCell = ({ row }: { row: Row<HikeAgency> }) => {
  const DeleteAgencyMutation = {
    mutationFn: deleteTravelAgency,
    onSuccess: () => {
      toast.success(`${row.original.name} deleted successfully`)
      queryClient.invalidateQueries({
        queryKey: ["travel-agencies"]
      })
      queryClient.invalidateQueries({
        queryKey: ["travelAgencyDetails", row.original._id]
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
        href={`/travel-agencies/${row.original._id}`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View travel agency details"
      >
        <span className="sr-only">View travel agency details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="">
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

export const columns: ColumnDef<HikeAgency>[] = [
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
    accessorKey: "status",
    header: "Status"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell
  }
]

export function TravelAgencies({ pageSize, data }: { pageSize: number; data: TravelAgency[] }) {
  return (
    <div className="w-full">
      <DataTable pageSize={pageSize} data={data} columns={columns} placeholder="Search by name..." searchKey="name" />
    </div>
  )
}
