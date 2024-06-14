import { Input } from "@/components/ui/input"

import { FiBell, FiSearch } from "react-icons/fi"
import Toggle from "./Toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import logout from "@/actions/logout"
import DefaultAvatar from "@/assets/images/default_pp.png"
import { ChevronDown } from "lucide-react"
import { IUser } from "@/api/auth/types"

export default function NavBar({
  user
}: {
  user?: IUser
}) {
  const isNotif = true

  return (
    <header className={"shrink-0 bg-[#FCFCFC] px-5 py-3"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-10">
          <Toggle />
          <div className="text-primary-gray flex w-[20rem] grow items-center rounded-lg bg-[#F4F4F4] px-3 py-1">
            <FiSearch size={22} />
            <Input
              type="text"
              className="text-primary-gray w-full border-none bg-transparent text-sm shadow-none"
              placeholder="Search for something..."
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button className="text-primary-gray active:bg-primary-gray relative flex p-2 duration-300 ease-in-out hover:text-slate-400 active:rounded-full active:text-white">
            <FiBell size={24} />
            {isNotif && <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-red-500"></span>}
          </button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-primary-black flex items-center gap-3 font-medium">
                <Image
                  src={user?.profile_picture || DefaultAvatar}
                  alt="user avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="capitalize">{user?.first_name ?? "user"}</span>
                <ChevronDown className="w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="text-primary-black right-0 mr-2 min-w-[10rem]"
                align="end"
                sideOffset={10}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <form action={logout}>
                  <DropdownMenuItem className="relative">
                    <button className="w-full text-start" type="submit">
                      Logout
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
