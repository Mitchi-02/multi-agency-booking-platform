"use client"
import { SideNavItem } from "@/lib/types"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const SideBarElement = ({ item, toggleCollapse }: { item: SideNavItem; toggleCollapse: Boolean }) => {
  const pathname = usePathname()
  const isActive = pathname === "/" ? item.link === "/" : item.link !== "/" && pathname.includes(item.link)
  return (
    <>
      {item.hasChildren ? (
        <div className="text-primary-gray flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 12a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1Z" />
          </svg>
        </div>
      ) : (
        <Link
          href={item.link}
          className={`flex items-center gap-3 rounded-md px-4 py-4 transition duration-300 ease-in-out
           ${isActive ? "text-primary-blue bg-[#E9F3FF] font-semibold" : "text-primary-gray font-semibold"} 
           hover:text-primary-blue hover:bg-[#E9F3FF]`}
        >
          {item.icon && <item.icon className="h-5 w-5" stroke="currentColor" strokeWidth={0.5} />}
          {!toggleCollapse && <span className="text-sm">{item.title}</span>}
        </Link>
      )}
    </>
  )
}
