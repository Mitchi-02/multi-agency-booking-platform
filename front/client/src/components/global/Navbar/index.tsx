import { getSession } from "@/actions/getSession"
import Link from "next/link"
import logout from "@/actions/logout"
import Logo from "@/assets/logo.svg"
import US from "@/assets/icons/lang/us.webp"
import Image from "next/image"
import Notif from "@/assets/icons/notif.svg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { TriangleDownIcon } from "@radix-ui/react-icons"
import DefaultAvatar from "@/assets/images/default_pp.png"


export default async function Navbar() {
  const session = await getSession()
  return (
    <header className="bg-white font-dm-sans shadow-[0px_-1px_4px_0px_#E2E2EA]">
      <div className="page-container grid grid-cols-3 gap-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Logo width={30} />
          <span className="text-xl font-bold">TripX</span>
        </Link>
        <nav className="flex justify-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-3 font-medium transition-colors duration-300 hover:text-primary-blue"
          >
            Home
          </Link>
          <Link
            href="/hikes"
            className="flex items-center gap-3 font-medium transition-colors duration-300 hover:text-primary-blue"
          >
            Hikes
          </Link>
          <Link
            href="/travels"
            className="flex items-center gap-3 font-medium transition-colors duration-300 hover:text-primary-blue"
          >
            Travels
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-6">
          <button className="flex items-center gap-4 text-sm font-bold text-primary-gray">
            EN
            <Image src={US} alt="us flag" width={20} height={20} />
          </button>
          <button>
            <Notif width={24} height={24} />
          </button>
          <span className="w-0.5 bg-primary-gray opacity-20" />
          {session.user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 font-medium text-primary-black">
                <Image
                  src={session.user?.profile_picture || DefaultAvatar}
                  alt="user avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="capitalize">{session.user?.first_name ?? "user"}</span>
                <TriangleDownIcon className="w-8 scale-125" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="right-0 mr-2 min-w-[10rem] text-primary-black"
                align="end"
                sideOffset={10}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <Link href="/profile" className="block w-full px-2 py-1.5">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href="/profile/travels" className="block w-full px-2 py-1.5">
                    Travel bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href="/profile/hikes" className="block w-full px-2 py-1.5">
                    Hike bookings
                  </Link>
                </DropdownMenuItem>
                <form action={logout}>
                  <DropdownMenuItem className="relative p-0">
                    <button className="block w-full px-2 py-1.5 text-start" type="submit">
                      Logout
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!session.user && (
            <div className="flex gap-3">
              <Link href="/login" className="font-medium text-primary-blue hover:underline">
                Login
              </Link>
              <span className="w-[1px] block bg-primary-gray opacity-20" />
              <Link href="/signup" className="font-medium text-primary-blue hover:underline">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
