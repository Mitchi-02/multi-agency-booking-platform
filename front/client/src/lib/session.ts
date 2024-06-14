import { SessionOptions } from "iron-session"

export const sessionOptions: SessionOptions = {
  password: process.env.NEXT_PUBLIC_SESSION_SECRET ?? "12345678901234567890123456789012",
  cookieName: "session",
  cookieOptions: {
    httpOnly: true,
    expires: new Date("2024-12-31")
  }
}
