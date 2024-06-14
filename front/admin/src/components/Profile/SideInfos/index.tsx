"use client"

import Image from "next/image"
import React, { useRef } from "react"
import SuccessIcon from "@/assets/icons/Vector.svg"
import EditIcon from "@/assets/icons/edit.svg"
import { updateUser } from "@/api/auth"
import { updateSession } from "@/actions/updateSession"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"
import { IUser } from "@/api/auth/types"
import DefaultPP from "@/assets/images/default_pp.png"
import { DateTime } from "luxon"

export default function SideInfos({ user }: { user: IUser }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditIconClick = () => {
    fileInputRef.current?.click()
  }

  const EditMutation = {
    mutationFn: updateUser,
    onSuccess: async (data: any) => {
      await updateSession({ user: data.data.user, accessToken: data.data.token })
      toast.success("Profile picture updated")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(EditMutation)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      mutation.mutate({ profile_picture: file })
    }
  }

  return (
    <div className="flex  flex-col gap-10 rounded-xl bg-white px-7 py-20">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <Image
            className="rounded-full"
            src={user.profile_picture ?? DefaultPP}
            alt="profile picture"
            width={120}
            height={120}
          />

          <div
            className="absolute bottom-0 right-0 cursor-pointer duration-150 hover:scale-110"
            onClick={handleEditIconClick}
          >
            <EditIcon width={35} height={35} />
          </div>
        </div>
        <div className="text-3xl font-semibold">
          {user.first_name} {user.last_name}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        {user.verified ? (
          <div className="flex items-center gap-3 rounded-3xl bg-gray-100 px-4 py-2 text-sm text-gray-600">
            <SuccessIcon width={12} height={12} />
            Identity verified
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-3xl bg-red-100 px-4 py-2 text-sm text-red-600">
            Not verified
          </div>
        )}
      </div>
      <hr />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-24  ">
          <div className="font-medium ">From</div>
          <div className="text-gray-600">Algeria</div>
        </div>
        <div className="flex justify-between gap-24 ">
          <div className="font-medium ">Member since</div>
          <div className="text-gray-600">{DateTime.fromISO(user.created_at).toFormat("LLLL dd yyyy")}</div>
        </div>
      </div>
    </div>
  )
}
