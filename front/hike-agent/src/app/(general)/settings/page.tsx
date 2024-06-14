import { getSession } from "@/actions/getSession"
import HikeAgency from "@/components/HikeAgency"
import { notFound } from "next/navigation"

export default async function HikeAgencyDetails() {
  const { agency } = await getSession()
  if (!agency) notFound()
  return <HikeAgency agency={agency} />
}
