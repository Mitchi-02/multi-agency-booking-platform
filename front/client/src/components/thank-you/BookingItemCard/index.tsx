import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn, formatPrice } from "@/lib/utils"
import { BookingItem } from "@/api/booking/travel_booking/types"
import Phone from "@/assets/icons/hikes-travels/phone.svg"
import Person from "@/assets/icons/hikes-travels/person.svg"
import Kid from "@/assets/icons/hikes-travels/kid.svg"
import Wallet from "@/assets/icons/hikes-travels/wallet.svg"
import Total from "@/assets/icons/hikes-travels/total.svg"
import Ticket from "@/assets/icons/hikes-travels/ticket.svg"
import Calendar from "@/assets/icons/hikes-travels/calendar.svg"
import { DateTime } from "luxon"
import { PaymentMethod } from "@/api/booking/types"
import StatusIcon from "@/components/bookings/BookingCard/StatusIcon"

interface BookingItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  data: BookingItem
  date: string
  payment: PaymentMethod
  showStatus?: boolean
}

export default function BookingItemCard({
  id,
  data,
  date,
  showStatus,
  payment,
  className,
  ...props
}: BookingItemProps) {
  const items = [
    {
      icon: data.type === "adult" ? Person : Kid,
      title: "Full name",
      value: data.full_name
    },
    {
      icon: Phone,
      title: "Phone number",
      value: data.phone
    },
    {
      icon: Ticket,
      title: "Booking code",
      value: data._id
    },
    {
      icon: Calendar,
      title: "Date",
      value: DateTime.fromISO(date).toFormat(`dd LLLL yyyy, HH:mm`)
    },
    {
      icon: Total,
      title: "Total",
      value: formatPrice(data.price)
    },
    {
      icon: Wallet,
      title: "Payment method",
      value: payment
    }
  ]

  return (
    <article className={cn("rounded-lg bg-input_bg px-6 py-5", className)} {...props}>
      <ul className="space-y-5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between gap-5 font-medium">
            <span className="flex items-center gap-2 text-primary-gray">
              <item.icon width={18} height={18} />
              {item.title}
            </span>
            <span className="capitalize">{item.value}</span>
          </li>
        ))}
        {showStatus && (
          <li className="flex w-fit items-center gap-2 rounded-lg bg-white py-2 pl-3 pr-5 font-medium capitalize text-primary-gray">
            <StatusIcon status={data.status} width={20} height={20} />
            {data.status}
          </li>
        )}
      </ul>
    </article>
  )
}
