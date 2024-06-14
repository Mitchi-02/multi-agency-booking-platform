"use server"

import { SessionData } from "@/lib/types/session"
import { sessionOptions } from "../lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export const getSession = () => {
  return getIronSession<SessionData>(cookies(), sessionOptions)
}
