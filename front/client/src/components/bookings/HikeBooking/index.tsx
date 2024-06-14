"use client"

import { DetailedHTMLProps, HTMLAttributes, useCallback } from "react"
import { CustomAxiosError, SuccessResponse } from "@/api/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import NotFound from "../../global/NotFound"
import { cn } from "@/lib/utils"
import { deleteBookingById } from "@/api/booking/hike_booking"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Flag from "@/assets/icons/hikes-travels/flag.svg"
import ResumeCard from "@/components/booking/ResumeCard"
import BookingItemCard from "@/components/thank-you/BookingItemCard"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import { useRouter } from "next/navigation"
import { getHikeBookingById } from "@/api/booking/hike_booking"
import { CompleteHikeBooking } from "@/api/booking/hike_booking/types"
import { HikeDetails } from "@/api/hike/types"
import { getHikeDetails } from "@/api/hike"
import { createHikeBookingReview, getHikeBookingReview } from "@/api/review/hike_review"
import { HikeReview } from "@/api/review/hike_review/types"
import { ReviewSchemaType } from "@/lib/types/review"
import ProfileReview from "../ProfileReview"
import ReviewForm from "../ReviewForm"

interface HikeBookingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
}

export default function HikeBooking({ id, className, ...props }: HikeBookingProps) {
  const router = useRouter()
  const { error: bookingError, data: booking } = useQuery<any, CustomAxiosError, CompleteHikeBooking>({
    queryFn: () => getHikeBookingById(id),
    queryKey: ["hikeBookingDetails", id]
  })

  const { error, data: hike } = useQuery<any, CustomAxiosError, HikeDetails>({
    queryFn: () => getHikeDetails(booking?.hike._id ?? ""),
    queryKey: ["hikeDetails", booking?.hike._id ?? ""]
  })

  const { data: review } = useQuery<any, CustomAxiosError, HikeReview>({
    queryFn: () => getHikeBookingReview(id),
    queryKey: ["hikeBookingReview", id]
  })

  const { mutate: mutateDelete, isPending } = useMutation<SuccessResponse<CompleteHikeBooking>, CustomAxiosError>({
    mutationFn: () => deleteBookingById(id),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Booking cancelled")
      queryClient.invalidateQueries({
        queryKey: ["hikeBookings"]
      })
      router.push("/profile/hikes")
    },
    mutationKey: ["deleteHikeBooking"]
  })

  const { mutate: mutateReview, isPending: isPendingReview } = useMutation<
    SuccessResponse<HikeReview>,
    CustomAxiosError,
    ReviewSchemaType
  >({
    mutationFn: (data) =>
      createHikeBookingReview({
        booking_id: id,
        ...data
      }),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Review submited")
      queryClient.invalidateQueries({
        queryKey: ["hikeBookingReview", id]
      })
    },
    mutationKey: ["createHikeBookingReview"]
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

  if (error?.response?.status === 404 || !hike || !booking || bookingError?.response?.status === 404) {
    return <NotFound />
  }

  return (
    <section
      className={cn("page-container page-container-sm flex items-start gap-20 pb-20 font-dm-sans", className)}
      {...props}
    >
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
            <BookingItemCard
              showStatus
              data={item}
              key={item._id}
              payment={booking.method}
              date={hike.departure_date}
            />
          ))}
        </ul>{" "}
        {review ? (
          <ProfileReview review={review} className="pt-10" />
        ) : (
          booking.paid && <ReviewForm mutate={mutateReview} loading={isPendingReview} className="pt-10" />
        )}
      </section>
      <ResumeCard
        hidePlacesLeft
        paymentLink={
          booking.method !== "cash" && !booking.paid
            ? `/hikes/${booking.hike._id}/booking/${booking._id}/checkout`
            : undefined
        }
        hideSubmit
        loading={false}
        className={`shrink-0 basis-[27rem]`}
        data={hike}
        cancelFn={booking.method !== "cash" && !booking.paid ? mutateDelete : undefined}
        isCancelLoading={isPending}
        total={booking.price}
        kids={booking.booking_items.filter((item) => item.type === "kid").length}
        adults={booking.booking_items.filter((item) => item.type === "adult").length}
        discount={20000}
        extra={extra()}
      />
    </section>
  )
}
