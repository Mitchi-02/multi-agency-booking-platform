import Pending from "@/assets/icons/status/pending.svg"
import Confirmed from "@/assets/icons/status/confirmed.svg"
import Cancelled from "@/assets/icons/status/cancelled.svg"
import { SVGProps } from "react"
import { BookingStatus } from "@/api/booking/types"

interface StatusIconProps extends SVGProps<SVGSVGElement> {
  status: BookingStatus
}

export default function StatusIcon({ status, ...props }: StatusIconProps) {
  switch (status) {
    case "pending":
      return <Pending {...props} />
    case "confirmed":
      return <Confirmed {...props} />
    case "cancelled":
      return <Cancelled {...props} />
    default:
      return null
  }
}
