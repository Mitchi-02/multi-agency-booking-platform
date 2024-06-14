"use client"

import Image from "next/image"
import Logo from "../../../../public/logo.svg?url"
import { routes } from "../../../routes"
import { SideBarElement } from "./SideBarElement"
import { useSidebarToggle } from "@/lib/hooks/use-sidebar_toggle"
import { cn } from "@/lib/utils"
import { IAgency } from "@/api/auth/types"

export default function SideBar({ agency }: { agency?: IAgency }) {
  const { toggleCollapse } = useSidebarToggle()

  return (
    <aside
      className={cn(
        "sidebar shrink-0 overflow-x-auto overflow-y-auto bg-[#FCFCFC] font-open-sans transition duration-300 ease-in",
        toggleCollapse ? "w-[5rem]" : "w-[16rem]"
      )}
    >
      <div className="relative flex items-center gap-4 p-6">
        {!agency ? (
          <>
            <Image src={Logo} alt="logo" width={32} height={32} />
            {!toggleCollapse && <h1 className="text-lg font-bold uppercase">Tripx Travel Agent</h1>}
          </>
        ) : (
          <>
            <Image src={agency.logo ?? Logo} alt="logo" width={60} height={32} />
            {!toggleCollapse && <h1 className="text-lg font-bold uppercase">{agency.name}</h1>}
          </>
        )}
      </div>
      <nav className="grid px-3 pt-10 transition duration-300 ease-in-out">
        {routes.map((item, index) => {
          return <SideBarElement key={index} item={item} toggleCollapse={toggleCollapse} />
        })}
      </nav>
    </aside>
  )
}
