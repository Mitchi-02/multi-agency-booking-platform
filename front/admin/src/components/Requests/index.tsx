"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { AgencyRequest } from "@/api/request/types"
import { DateTime } from "luxon"
import { deleteRequest } from "@/api/request"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
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

const ActionsCell = ({ row }: { row: Row<AgencyRequest> }) => {
  const DeleteAgencyMutation = {
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast.success(`${row.original._id} deleted successfully`)
      queryClient.invalidateQueries({
        queryKey: ["requests"]
      })
      queryClient.invalidateQueries({
        queryKey: ["requestDetails", row.original._id]
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
        href={`/requests/${row.original._id}`}
        className="rounded-md px-4 py-2  hover:bg-gray-100"
        title="View request details"
      >
        <span className="sr-only">View request details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="">
            <span className="sr-only">Delete request</span>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete request of {row.original.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this request.
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

export const columns: ColumnDef<AgencyRequest>[] = [
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "createdAt",
    header: "Created At"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell
  }
]

export function Requests({ pageSize, data }: { pageSize: number; data: AgencyRequest[] }) {
  return (
    <div className="w-full">
      <DataTable
        pageSize={pageSize}
        data={data.map((d) => ({
          ...d,
          createdAt: DateTime.fromISO(d.createdAt).toFormat("LLL dd yyyy")
        }))}
        placeholder="Search by email..."
        searchKey="email"
        columns={columns}
        filter={{
          data: [
            { value: "pending", label: "Pending" },
            { value: "accepted", label: "Accepted" },
            { value: "refused", label: "Refused" }
          ],
          key: "status"
        }}
      />
    </div>
  )
}
