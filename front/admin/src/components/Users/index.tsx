"use client"

import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EyeIcon } from "lucide-react"
import Link from "next/link"
import { deleteUser } from "@/api/user"
import { toast } from "react-toastify"
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
import { useMutation } from "@tanstack/react-query"
import queryClient from "@/lib/queryClient"
import { Role } from "@/lib/schemas/user"
import DefaultPP from "@/assets/images/default_pp.png"
import Image from "next/image"

export type User = {
  name: string
  role: string
  email: string
  phone: string
  photo: string
  id: number
}

const UserCell = ({ row }: { row: Row<User> }) => {
  return (
    <div className="flex items-center justify-start gap-2">
      <Image src={row.original.photo ?? DefaultPP} width={40} height={40} alt="user" className="rounded-full" />
    </div>
  )
}

const ActionsCell = ({ row }: { row: Row<User> }) => {
  const DeleteUserMutation = {
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(DeleteUserMutation)
  const handleDelete = async (id: number) => {
    mutation.mutate(id)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Link href={`/users/${row.original.id}`} className="rounded-md px-4 py-2  hover:bg-gray-100 ">
        <span className="sr-only">View user details</span>
        <EyeIcon className="h-4 w-4" />
      </Link>
      {row.original.role !== Role.ADMIN && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="">
              <span className="sr-only">Delete user</span>
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure to delete {row.original.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this user.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-900" onClick={() => handleDelete(row.original.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    id: "photo",
    header: "Photo",
    enableHiding: false,
    cell: UserCell
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "role",
    header: "Role"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "phone",
    header: "Phone"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionsCell
  }
]

export default function UsersList({ pageSize, data }: { pageSize: number; data: User[] }) {
  return (
    <div className="w-full">
      <DataTable
        filter={{
          data: [
            { value: Role.CLIENT, label: "Client" },
            { value: Role.ADMIN, label: "Admin" },
            { value: Role.HIKE_AGENT, label: "Hike Agent" },
            { value: Role.TRAVEL_AGENT, label: "Travel Agent" }
          ],
          key: "role"
        }}
        pageSize={pageSize}
        data={data}
        searchKey="name"
        placeholder="Search by name..."
        columns={columns}
      />
    </div>
  )
}
