import { FaPlaneDeparture, FaTicketAlt } from "react-icons/fa"
import { AiOutlineSetting } from "react-icons/ai"
import { GoHome } from "react-icons/go"
import { SideNavItem } from "./lib/types"
import { MdOutlinePreview } from "react-icons/md"

export const routes: SideNavItem[] = [
  {
    title: "Dashboard",
    icon: GoHome,
    link: "/",
    hasChildren: false
  },
  {
    title: "Travels",
    icon: FaPlaneDeparture,
    link: "/travels",
    hasChildren: false
  },
  {
    title: "Bookings",
    icon: FaTicketAlt,
    link: "/bookings",
    hasChildren: false
  },
  {
    title: "Reviews",
    icon: MdOutlinePreview,
    link: "/reviews",
    hasChildren: false
  },
  {
    title: "Agency Settings",
    icon: AiOutlineSetting,
    link: "/settings",
    hasChildren: false
  }
]
