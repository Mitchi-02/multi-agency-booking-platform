import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs"
import { FRONT_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { ConfirmPaymentData, PaymentIntentResult, StripePaymentElementOptions } from "@stripe/stripe-js"
import { useMutation } from "@tanstack/react-query"
import { DetailedHTMLProps, HTMLAttributes, useMemo } from "react"
import { toast } from "react-toastify"
import CashImage from "@/assets/images/payment/cash.png"
import CardImage from "@/assets/images/payment/card.png"
import Check from "@/assets/icons/check.svg"

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface CheckoutFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  mutateCash: () => void
  isPendingCash: boolean
  returnUrl: string
}

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
  fields: {
    billingDetails: {
      address: {
        country: "never"
      }
    }
  }
}

export default function CheckoutForm({ className, mutateCash, isPendingCash, returnUrl, ...props }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const confirmParams: ConfirmPaymentData = useMemo(
    () => ({
      payment_method_data: {
        billing_details: {
          address: {
            country: "DZ"
          }
        }
      },
      return_url: `${
        FRONT_URL[(process.env.NEXT_PUBLIC_NODE_ENV ?? "development") as keyof typeof FRONT_URL]
      }${returnUrl}`
    }),
    [returnUrl]
  )

  const { mutate, isPending: isLoadingMutate } = useMutation<PaymentIntentResult, Error>({
    mutationFn: () => {
      if (!stripe || !elements) throw new Error("Stripe.js has not loaded")
      return stripe.confirmPayment({
        elements,
        confirmParams
      })
    },
    onSuccess: (payload) => {
      if (payload.error) {
        // If there is an error in the payload, show an error toast
        // toast({
        //   title: payload.error.message,
        //   status: "error",
        //   duration: 3000
        // })
      } else {
        // toast({
        //   title: t("order-saved-successfully"),
        //   status: "success"
        // })
      }
    }
  })

  return (
    <section className={cn(className, "mr-auto max-w-[470px]")} {...props}>
      <h2 className="text-2xl font-medium">Payment method</h2>
      <Tabs defaultValue="stripe" className="pt-5">
        <TabsList className="gap-4">
          <TabsTrigger
            value="stripe"
            className="group relative h-12 w-24 rounded-md border border-input_bg bg-white data-[state=active]:border-primary-blue"
          >
            <Image src={CardImage} alt="Card" className="w-10" />
            <span className="absolute right-0 top-0 hidden aspect-square w-4 -translate-y-1/2 translate-x-1/2 place-content-center rounded-full bg-primary-blue text-white group-data-[state=active]:grid">
              <Check width={9} height={5} />
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="cash"
            className="group relative h-12 w-24 rounded-md border border-input_bg bg-white data-[state=active]:border-primary-blue"
          >
            <Image src={CashImage} alt="Card" className="w-10" />
            <span className="absolute right-0 top-0 hidden aspect-square w-4 -translate-y-1/2 translate-x-1/2 place-content-center rounded-full bg-primary-blue text-white group-data-[state=active]:grid">
              <Check width={9} height={5} />
            </span>
          </TabsTrigger>{" "}
        </TabsList>
        <Separator className="my-8 rounded-lg" />

        <TabsContent forceMount value="stripe" className="hidden data-[state=active]:block" asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutate()
            }}
          >
            <PaymentElement id="payment-element" options={paymentElementOptions} className="pb-10" />
            <Button
              variant="primary"
              disabled={isLoadingMutate}
              className={cn("h-auto w-full rounded-lg px-6 py-3 text-sm")}
              type="submit"
            >
              {isLoadingMutate ? <Spinner className="size-5 fill-primary-black text-white" /> : "Confirm Card Payment"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent forceMount value="cash" className="hidden data-[state=active]:block" asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutateCash()
            }}
          >
            <h3 className="pb-4 text-xl font-bold text-error">Note!</h3>
            <p>To have your booking fully confirmed you have to pay the booking fee before:</p>
            <p className="py-3 text-lg font-medium text-primary-gray">30 march 2024</p>
            <p className="mb-8">Otherwise the trip will be canceled...</p>

            <Button
              variant="primary"
              disabled={isPendingCash}
              className={cn("h-auto w-full rounded-lg px-6 py-3 text-sm")}
              type="submit"
            >
              {isPendingCash ? <Spinner className="size-5 fill-primary-black text-white" /> : "Confirm Cash Payment"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </section>
  )
}
