import { getSession } from "@/actions/getSession"
import ProfileForm from "@/components/profile/ProfileForm"
import SideInfos from "@/components/profile/SideInfos"
import React from "react"

export default async function ProfilePage() {
  const session = await getSession()
  return (
    <main className="page-container page-container-sm flex flex-col gap-10 py-10 md:flex-row">
      <SideInfos user={session.user!} />
      <ProfileForm user={session.user!} />
    </main>
  )
}
