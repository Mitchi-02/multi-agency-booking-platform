import { FaMountain, FaPlaneDeparture } from "react-icons/fa"
import { GoHome, GoPeople } from "react-icons/go"
import { SideNavItem } from "./lib/types"
import { FaWpforms } from "react-icons/fa6"

export const routes: SideNavItem[] = [
  {
    title: "Dashboard",
    icon: GoHome,
    link: "/",
    hasChildren: false
  },
  {
    title: "Travel Agencies",
    icon: FaPlaneDeparture,
    link: "/travel-agencies",
    hasChildren: false
  },
  {
    title: "Hike Agencies",
    icon: FaMountain,
    link: "/hiking-agencies",
    hasChildren: false
  },
  {
    title: "Users",
    icon: GoPeople,
    link: "/users",
    hasChildren: false
  },
  {
    title: "Agency Requests",
    icon: FaWpforms,
    link: "/requests",
    hasChildren: false
  },
]
