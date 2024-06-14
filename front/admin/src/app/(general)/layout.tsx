import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "@/components/dashboard/Navbar"
import SideBar from "@/components/dashboard/SiderBar"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-[100dvh]">
      <SideBar />
      <div className="flex grow flex-col overflow-y-hidden">
        <NavBar />
        <main className="grow overflow-y-scroll p-10">{children}</main>
      </div>
    </div>
  )
}
