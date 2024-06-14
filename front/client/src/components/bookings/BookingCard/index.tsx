"use client"

import { ListHikeBooking } from "@/api/booking/hike_booking/types"
import { ListTravelBooking } from "@/api/booking/travel_booking/types"
import { cn, formatPrice } from "@/lib/utils"
import Money from "@/assets/icons/hikes-travels/money.svg"
import Kid from "@/assets/icons/hikes-travels/kid.svg"
import Adult from "@/assets/icons/hikes-travels/person.svg"
import Wallet from "@/assets/icons/hikes-travels/wallet.svg"
import Link from "next/link"
import { DateTime } from "luxon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react"
import { BsEye } from "react-icons/bs"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  booking: ListTravelBooking | ListHikeBooking
  href: string
  onDelete?: () => void
  paymentLink?: string
  isCancelLoading?: boolean
}

export default function BookingCard({
  booking,
  isCancelLoading,
  onDelete,
  href,
  paymentLink,
  className,
  ...props
}: Props) {
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    if (!isCancelLoading) setClicked(false)
  }, [isCancelLoading])
  return (
    <article className={cn(className, "block rounded-lg bg-white px-6 py-4")} {...props}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-medium">
          {"travel" in booking ? booking.travel.destination : booking.hike.destination}
        </h2>
        <div className="flex items-center gap-4">
          <span
            title={booking.paid ? "Paid" : "Not paid"}
            className={cn("flex items-center gap-1 text-sm font-bold", booking.paid ? "text-green-700" : "text-error")}
          >
            <Money width={25} height={25} /> {formatPrice(booking.price)}
          </span>
          <Link
            href={href}
            className="grid aspect-square w-7 place-content-center rounded-md bg-primary-gray duration-200 hover:opacity-90"
          >
            <BsEye className="aspect-square w-4 text-white" />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="font-medium text-primary-gray">
          By {"travel_agency" in booking ? booking.travel_agency.name : booking.hike_agency.name}
        </p>
        <div className="flex items-center gap-2 capitalize">
          <Wallet width={25} height={25} />
          <span>{booking.method}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <span className="font-medium">
          {DateTime.fromISO("travel" in booking ? booking.travel.departure_date : booking.hike.departure_date).toFormat(
            `dd LLLL yyyy, HH:mm`
          )}
        </span>
        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-2">
            <Adult width={20} height={20} />
            <span>{booking.booking_items.map((b) => b.type === "adult").length}</span>
          </span>
          <span className="flex items-center gap-2">
            <Kid width={25} height={25} />
            <span>{booking.booking_items.map((b) => b.type === "kid").length}</span>
          </span>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        {paymentLink && (
          <Button
            variant="primary"
            disabled={isCancelLoading && clicked}
            className={cn("ml-auto h-auto w-full basis-1/2 !block px-0 py-0 text-sm")}
            type="button"
          >
            <Link href={paymentLink} className="block rounded-lg px-4 py-2">
              Pay now
            </Link>
          </Button>
        )}
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isCancelLoading && clicked}
                className={cn("ml-auto h-auto w-full basis-1/2 rounded-lg px-4 py-2 text-sm")}
                type="button"
              >
                {isCancelLoading && clicked ? <Spinner className="size-4 fill-primary-black text-white" /> : "Cancel"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-dm-sans">Booking Cancelation</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to cancel this booking ?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-error text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-green-800 text-white hover:bg-primary-blue"
                  disabled={isCancelLoading && clicked}
                  onClick={() => {
                    setClicked(true)
                    onDelete()
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </article>
  )
}
