"use client"

import { TravelDetails } from "@/api/travel/types"
import { DetailedHTMLProps, HTMLAttributes, useCallback } from "react"
import { CustomAxiosError, SuccessResponse } from "@/api/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import NotFound from "../../global/NotFound"
import { cn } from "@/lib/utils"
import { getTravelDetails } from "@/api/travel"
import { CompleteTravelBooking, TravelPayment } from "@/api/booking/travel_booking/types"
import { deleteBookingById, getTravelBookingById, payBookingCash } from "@/api/booking/travel_booking"
import { toast } from "react-toastify"
import queryClient from "@/lib/queryClient"
import { useRouter } from "next/navigation"
import ResumeCard from "@/components/booking/ResumeCard"
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "../CheckoutForm"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

interface TravelBookingCheckoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
  bookingId: string
  payment: TravelPayment
}

export default function TravelBookingCheckout({
  id,
  bookingId,
  payment,
  className,
  ...props
}: TravelBookingCheckoutProps) {
  const router = useRouter()
  const { error, data: travel } = useQuery<any, CustomAxiosError, TravelDetails>({
    queryFn: () => getTravelDetails(id),
    queryKey: ["travelDetails", id]
  })

  const { error: bookingError, data: booking } = useQuery<any, CustomAxiosError, CompleteTravelBooking>({
    queryFn: () => getTravelBookingById(bookingId),
    queryKey: ["travelBookingDetails", bookingId]
  })

  const { mutate: mutateDelete, isPending } = useMutation<SuccessResponse<CompleteTravelBooking>, CustomAxiosError>({
    mutationFn: () => deleteBookingById(bookingId),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Booking cancelled")
      router.push(`/travels/${id}`)
      queryClient.invalidateQueries({
        queryKey: ["travelBookingDetails", bookingId]
      })
      queryClient.invalidateQueries({
        queryKey: ["travelDetails", id]
      })
      queryClient.invalidateQueries({
        queryKey: ["travelBookings"]
      })
    },
    mutationKey: ["deleteTravelBooking", bookingId]
  })

  const { mutate: mutateCash, isPending: isPendingCash } = useMutation<SuccessResponse<null>, CustomAxiosError>({
    mutationFn: () => payBookingCash(bookingId),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Booking successful")
      router.push(`/travels/${id}/booking/${bookingId}/checkout/thank-you`)
    },
    mutationKey: ["travelCashPayment", bookingId]
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
    <section className={cn("page-container page-container-sm pb-20 font-dm-sans", className)} {...props}>
      <h1 className="mb-6 text-4xl font-medium">Travel Checkout</h1>
      <div className="flex items-start gap-20">
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            returnUrl={`/travels/${id}/booking/${bookingId}/checkout/thank-you`}
            isPendingCash={isPendingCash}
            mutateCash={mutateCash}
            className="grow"
          />
        </Elements>

        <ResumeCard
          hideSubmit
          cancelFn={mutateDelete}
          updateLink={`/travels/${id}/booking/${bookingId}`}
          loading={false}
          isCancelLoading={isPending}
          className={`shrink-0 basis-[27rem] ${isPendingCash ? "pointer-events-none" : ""}`}
          data={travel}
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
