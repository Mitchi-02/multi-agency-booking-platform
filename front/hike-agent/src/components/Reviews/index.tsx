"use client"

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/custom/data-table"
import { DateTime } from "luxon"
import { HikeReview } from "@/api/review/types"
import { ReviewUI } from "@/lib/types/hike"
import Image from "next/image"
import DefaultPP from "@/assets/images/default_pp.png"

const UserCell = ({ row }: { row: Row<ReviewUI> }) => {
  return (
    <div className="flex items-center justify-start gap-2">
      <Image src={row.original.user_photo ?? DefaultPP} width={40} height={40} alt="user" className="rounded-full" />
      <span className="text-sm font-medium capitalize">{row.original.user_name}</span>
    </div>
  )
}

export const columns: ColumnDef<ReviewUI>[] = [
  {
    id: "user",
    enableHiding: false,
    cell: UserCell
  },
  {
    accessorKey: "rating",
    header: "Rating"
  },
  {
    accessorKey: "comment",
    header: "Comment"
  },
  {
    accessorKey: "createdAt",
    header: "Created At"
  }
]

export function Reviews({ pageSize, data }: { pageSize: number; data: HikeReview[] }) {
  return (
    <div className="w-full">
      <DataTable
        pageSize={pageSize}
        data={data.map((d) => ({
          _id: d._id,
          user_photo: d.user.profile_picture,
          user_name: `${d.user.first_name} ${d.user.last_name}`,
          rating: d.rating,
          comment: d.comment,
          createdAt: DateTime.fromISO(d.createdAt).toFormat("LLL dd yyyy")
        }))}
        placeholder="Search by user name..."
        searchKey="user_name"
        columns={columns}
      />
    </div>
  )
}
