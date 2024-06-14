"use server"

import { SessionData } from "@/lib/types/session"
import { sessionOptions } from "../lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export const updateSession = async (newData: Partial<SessionData>) => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  Object.assign(session, newData)
  await session.save()
}
