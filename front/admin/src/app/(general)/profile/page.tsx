import { getSession } from "@/actions/getSession"
import ProfileForm from "@/components/Profile/ProfileForm"
import SideInfos from "@/components/Profile/SideInfos"
import React from "react"

export default async function ProfilePage() {
  const session = await getSession()
  return (
    <div className="flex gap-10">
      <SideInfos user={session.user!} />
      <ProfileForm user={session.user!} />
    </div>
  )
}
