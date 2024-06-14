import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "./actions/getSession"

const requireGuest = ["/login", "/signup", "/forgotpassword"]

const requireAuth = ["/verification", "/profile", "/booking"]

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const path = request.nextUrl.pathname

  if (session.user && requireGuest.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  if (requireAuth.find((p) => path.includes(p)) !== undefined) {
    if (!session.user) {
      return NextResponse.redirect(new URL(`/login?callback=${encodeURI(path)}`, request.url))
    }
    if (!path.includes('verification') && !session.user?.verified) {
      return NextResponse.redirect(new URL(`/verification?callback=${encodeURI(path)}`, request.url))
    }
    if (path.includes("verification") && session.user?.verified) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}
