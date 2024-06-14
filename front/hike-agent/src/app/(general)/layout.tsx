import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "@/components/dashboard/Navbar"
import SideBar from "@/components/dashboard/SiderBar"
import { getSession } from "@/actions/getSession"

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, agency } = await getSession()
  return (
    <div className="flex h-[100dvh]">
      <SideBar agency={agency} />
      <div className="flex grow flex-col overflow-y-hidden">
        <NavBar user={user} />
        <main className="grow overflow-y-scroll p-10">{children}</main>
      </div>
    </div>
  )
}
