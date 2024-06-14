"use client"

import { TravelDetails } from "@/api/travel/types"
import { DetailedHTMLProps, HTMLAttributes, useCallback } from "react"
import { CustomAxiosError, SuccessResponse } from "@/api/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import NotFound from "../../global/NotFound"
import { cn } from "@/lib/utils"
import { getTravelDetails } from "@/api/travel"
import { CompleteTravelBooking } from "@/api/booking/travel_booking/types"
import { deleteBookingById, getTravelBookingById } from "@/api/booking/travel_booking"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Flag from "@/assets/icons/hikes-travels/flag.svg"
import ResumeCard from "@/components/booking/ResumeCard"
import BookingItemCard from "@/components/thank-you/BookingItemCard"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import { useRouter } from "next/navigation"
import { TravelReview } from "@/api/review/travel_review/types"
import { createTravelBookingReview, getTravelBookingReview } from "@/api/review/travel_review"
import ProfileReview from "../ProfileReview"
import ReviewForm from "../ReviewForm"
import { ReviewSchemaType } from "@/lib/types/review"

interface TravelBookingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
}

export default function TravelBooking({ id, className, ...props }: TravelBookingProps) {
  const router = useRouter()
  const { error: bookingError, data: booking } = useQuery<any, CustomAxiosError, CompleteTravelBooking>({
    queryFn: () => getTravelBookingById(id),
    queryKey: ["travelBookingDetails", id]
  })

  const { error, data: travel } = useQuery<any, CustomAxiosError, TravelDetails>({
    queryFn: () => getTravelDetails(booking?.travel._id ?? ""),
    queryKey: ["travelDetails", booking?.travel._id ?? ""]
  })

  const { data: review } = useQuery<any, CustomAxiosError, TravelReview>({
    queryFn: () => getTravelBookingReview(id),
    queryKey: ["travelBookingReview", id]
  })

  const { mutate: mutateDelete, isPending } = useMutation<SuccessResponse<CompleteTravelBooking>, CustomAxiosError>({
    mutationFn: () => deleteBookingById(id),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Booking cancelled")
      queryClient.invalidateQueries({
        queryKey: ["travelBookings"]
      })
      router.push("/profile/travels")
    },
    mutationKey: ["deleteTravelBooking"]
  })

  const { mutate: mutateReview, isPending: isPendingReview } = useMutation<
    SuccessResponse<TravelReview>,
    CustomAxiosError,
    ReviewSchemaType
  >({
    mutationFn: (data) =>
      createTravelBookingReview({
        booking_id: id,
        ...data
      }),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Review submited")
      queryClient.invalidateQueries({
        queryKey: ["travelBookingReview", id]
      })
    },
    mutationKey: ["createTravelBookingReview"]
  })

  const extra = useCallback(() => {
    if (!booking || !travel) return 0
    return booking.booking_items.reduce((acc, item) => {
      return (
        acc +
        item.chosen_services.reduce((acc, service) => {
          const price = travel.complementary_services.find((s) => s.name === service)?.price ?? 0
          return acc + price
        }, 0)
      )
    }, 0)
  }, [booking])

  if (error?.response?.status === 404 || !travel || !booking || bookingError?.response?.status === 404) {
    return <NotFound />
  }
  return (
    <section
      className={cn("page-container page-container-sm flex items-start gap-20 pb-20 font-dm-sans", className)}
      {...props}
    >
      <section className="grow">
        <h2 className="text-3xl font-bold">{travel.title}</h2>
        <div className="flex items-center gap-10 pt-6 text-sm">
          <div className="flex items-center gap-2">
            <Flag className="shrink-0" width={20} height={20} />
            <span className="truncate text-primary-gray">{travel.destination}</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <StarIcon className="text-[#FFC542]" />
            <span>
              {travel.travel_agency.rating}{" "}
              <span className="text-primary-gray">({travel.travel_agency.reviews_count} reviews)</span>
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
              date={travel.departure_date}
            />
          ))}
        </ul>
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
            ? `/travels/${booking.travel._id}/booking/${booking._id}/checkout`
            : undefined
        }
        hideSubmit
        loading={false}
        className={`shrink-0 basis-[27rem]`}
        data={travel}
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
