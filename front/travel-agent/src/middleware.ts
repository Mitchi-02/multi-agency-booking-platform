import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "./actions/getSession"

const requireGuest = ["/login", "/forgotpassword"]

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const path = request.nextUrl.pathname

  if (requireGuest.includes(path)) {
    if (session.user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else if (!path.startsWith("/_next") && !path.includes("logo.svg")) {
    if (!session.user) {
      return NextResponse.redirect(new URL(`/login?callback=${encodeURI(path)}`, request.url))
    }
  }
  return NextResponse.next()
}
