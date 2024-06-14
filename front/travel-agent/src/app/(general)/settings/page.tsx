import { getSession } from "@/actions/getSession"
import TravelAgency from "@/components/TravelAgency"
import { notFound } from "next/navigation"

export default async function TravelAgencyDetails() {
  const { agency } = await getSession()
  if (!agency) notFound()
  return <TravelAgency agency={agency} />
}
