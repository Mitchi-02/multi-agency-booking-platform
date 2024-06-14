"use client"

import { useSidebarToggle } from "@/lib/hooks/use-sidebar_toggle"
import { BsList } from "react-icons/bs"

export default function Toggle() {
  const { invokeToggleCollapse } = useSidebarToggle()

  const sideBarToggle = () => {
    invokeToggleCollapse()
  }
  return (
    <button
      onClick={sideBarToggle}
      className="hover:text-primary-blue active:bg-primary-blue rounded-xl p-1 text-3xl transition duration-300 ease-in-out hover:bg-[#E9F3FF] active:text-[#E9F3FF]"
    >
      <BsList className="h-6 w-6" />
    </button>
  )
}
