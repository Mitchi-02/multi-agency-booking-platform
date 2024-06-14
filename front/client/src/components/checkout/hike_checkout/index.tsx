"use client"

import { HikeDetails } from "@/api/hike/types"
import { DetailedHTMLProps, HTMLAttributes, useCallback } from "react"
import { CustomAxiosError, SuccessResponse } from "@/api/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import NotFound from "../../global/NotFound"
import { cn } from "@/lib/utils"
import { CompleteHikeBooking, HikePayment } from "@/api/booking/hike_booking/types"
import { deleteBookingById, getHikeBookingById, payBookingCash } from "@/api/booking/hike_booking"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import { useRouter } from "next/navigation"
import ResumeCard from "@/components/booking/ResumeCard"
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "../CheckoutForm"
import { Elements } from "@stripe/react-stripe-js"
import { getHikeDetails } from "@/api/hike"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

interface HikeBookingCheckoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
  bookingId: string
  payment: HikePayment
}

export default function HikeBookingCheckout({ id, bookingId, payment, className, ...props }: HikeBookingCheckoutProps) {
  const router = useRouter()
  const { error, data: hike } = useQuery<any, CustomAxiosError, HikeDetails>({
    queryFn: () => getHikeDetails(id),
    queryKey: ["hikeDetails", id]
  })

  const { error: bookingError, data: booking } = useQuery<any, CustomAxiosError, CompleteHikeBooking>({
    queryFn: () => getHikeBookingById(bookingId),
    queryKey: ["hikeBookingDetails", bookingId]
  })

  const { mutate: mutateDelete, isPending } = useMutation<SuccessResponse<CompleteHikeBooking>, CustomAxiosError>({
    mutationFn: () => deleteBookingById(bookingId),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Booking cancelled")
      router.push(`/hikes/${id}`)
      queryClient.invalidateQueries({
        queryKey: ["hikeBookingDetails", bookingId]
      })
      queryClient.invalidateQueries({
        queryKey: ["hikeDetails", id]
      })
      queryClient.invalidateQueries({
        queryKey: ["hikeBookings"]
      })
    },
    mutationKey: ["deleteHikeBooking", bookingId]
  })

  const { mutate: mutateCash, isPending: isPendingCash } = useMutation<SuccessResponse<null>, CustomAxiosError>({
    mutationFn: () => payBookingCash(bookingId),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Booking successful")
      router.push(`/hikes/${id}/booking/${bookingId}/checkout/thank-you`)
    },
    mutationKey: ["hikeCashPayment", bookingId]
  })

  const options: StripeElementsOptions = {
    clientSecret: payment.client_secret,
    appearance: {
      theme: "stripe",

      variables: {
        fontFamily: "DM Sans, sans-serif",
        colorBackground: "#E7ECF3"
      },

      rules: {
        ".Label": {
          fontWeight: "500",
          fontSize: "0.875rem",
          color: "#3B3E44"
        },
        ".Input": {
          fontWeight: "500",
          fontSize: "1rem",
          color: "#3B3E44",
          paddingTop: "11px",
          paddingBottom: "11px",
          paddingLeft: "14px",
          paddingRight: "14px"
        },

        ".Input:focus": {
          borderColor: "#316BFF"
        }
      }
    }
  }

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
    <section className={cn("page-container page-container-sm pb-20 font-dm-sans", className)} {...props}>
      <h1 className="mb-6 text-4xl font-medium">Hike Checkout</h1>
      <div className="flex items-start gap-20">
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            returnUrl={`/hikes/${id}/booking/${bookingId}/checkout/thank-you`}
            isPendingCash={isPendingCash}
            mutateCash={mutateCash}
            className="grow"
          />
        </Elements>

        <ResumeCard
          hideSubmit
          cancelFn={mutateDelete}
          updateLink={`/hikes/${id}/booking/${bookingId}`}
          loading={false}
          isCancelLoading={isPending}
          className={`shrink-0 basis-[27rem] ${isPendingCash ? "pointer-events-none" : ""}`}
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
