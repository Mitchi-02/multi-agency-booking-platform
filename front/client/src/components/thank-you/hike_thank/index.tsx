"use client"

import { HikeDetails } from "@/api/hike/types"
import { DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useRef } from "react"
import { CustomAxiosError } from "@/api/types"
import { useQuery } from "@tanstack/react-query"
import NotFound from "../../global/NotFound"
import { cn } from "@/lib/utils"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Flag from "@/assets/icons/hikes-travels/flag.svg"
import ResumeCard from "@/components/booking/ResumeCard"
import BookingItemCard from "../BookingItemCard"
import { getHikeDetails } from "@/api/hike"
import { CompleteHikeBooking } from "@/api/booking/hike_booking/types"
import { getHikeBookingById } from "@/api/booking/hike_booking"
import queryClient from "@/lib/queryClient"

interface HikeThankYouProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
  bookingId: string
}

export default function HikeThankYou({ id, bookingId, className, ...props }: HikeThankYouProps) {
  const onceRef = useRef(false)
  const { error, data: hike } = useQuery<any, CustomAxiosError, HikeDetails>({
    queryFn: () => getHikeDetails(id),
    queryKey: ["hikeDetails", id]
  })

  const { error: bookingError, data: booking } = useQuery<any, CustomAxiosError, CompleteHikeBooking>({
    queryFn: () => getHikeBookingById(bookingId),
    queryKey: ["hikeBookingDetails", bookingId]
  })

  const extra = useCallback(() => {
    if (!booking || !hike) return 0
    return booking.booking_items.reduce((acc, item) => {
      return (
        acc +
        item.chosen_services.reduce((acc, service) => {
          const price = hike.complementary_services.find((s) => s.name === service)?.price ?? 0
          return acc + price
        }, 0)
      )
    }, 0)
  }, [booking])

    useEffect(() => {
      if (onceRef.current) return
      if (booking && hike) {
        onceRef.current = true
        queryClient.invalidateQueries({
          queryKey: ["hikeBookings"]
        })
      }
    }, [hike, booking])

  if (error?.response?.status === 404 || !hike || !booking || bookingError?.response?.status === 404) {
    return <NotFound />
  }

  return (
    <section className={cn("page-container page-container-sm pb-20 font-dm-sans", className)} {...props}>
      <h3 className="pb-6 text-2xl font-bold">Congratulations</h3>
      <h1 className="mb-6 text-4xl font-medium underline decoration-input_bg underline-offset-[2rem]">
        Your hike has been booked!
      </h1>
      <div className="flex items-start gap-20 pt-10">
        <section className="grow">
          <h2 className="text-3xl font-bold">{hike.title}</h2>
          <div className="flex items-center gap-10 pt-6 text-sm">
            <div className="flex items-center gap-2">
              <Flag className="shrink-0" width={20} height={20} />
              <span className="truncate text-primary-gray">{hike.destination}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <StarIcon className="text-[#FFC542]" />
              <span>
                {hike.hike_agency.rating}{" "}
                <span className="text-primary-gray">({hike.hike_agency.reviews_count} reviews)</span>
              </span>
            </div>
          </div>
          <h4 className="pb-5 pt-10 text-2xl font-bold">Reserve Details</h4>
          <ul className="grid max-w-[30rem] gap-4">
            {booking.booking_items.map((item) => (
              <BookingItemCard data={item} key={item._id} payment={booking.method} date={hike.departure_date} />
            ))}
          </ul>
        </section>
        <ResumeCard
          hidePlacesLeft
          returnUrl={`/hikes`}
          hideSubmit
          loading={false}
          className={`shrink-0 basis-[27rem]`}
          data={hike}
          total={booking.price}
          kids={booking.booking_items.filter((item) => item.type === "kid").length}
          adults={booking.booking_items.filter((item) => item.type === "adult").length}
          discount={20000}
          extra={extra()}
        />
      </div>
    </section>
  )
}
