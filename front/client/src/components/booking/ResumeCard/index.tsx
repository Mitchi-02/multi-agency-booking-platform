import { Separator } from "@/components/ui/separator"
import { calculatePrice, cn, formatPrice } from "@/lib/utils"
import { DateTime } from "luxon"
import { DetailedHTMLProps, HTMLAttributes, useMemo } from "react"
import { TravelDetails } from "@/api/travel/types"
import { HikeDetails } from "@/api/hike/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PLACES_LEFT_LIMIT } from "@/lib/constants/travels"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
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

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  kids: number
  adults: number
  discount: number
  extra: number
  loading?: boolean
  data: HikeDetails | TravelDetails
  cancelFn?: () => void
  updateLink?: string
  hideSubmit?: boolean
  isCancelLoading?: boolean
  total?: number
  hidePlacesLeft?: boolean
  returnUrl?: string
  existingBookings?: number
  paymentLink?: string
}

export default function ResumeCard({
  kids,
  adults,
  discount,
  className,
  loading,
  extra,
  data,
  paymentLink,
  cancelFn,
  updateLink,
  hideSubmit,
  isCancelLoading,
  total,
  hidePlacesLeft,
  returnUrl,
  existingBookings,
  ...rest
}: Props) {
  const price = useMemo(
    () => calculatePrice(adults, kids, data.adult_price, data.kid_price),
    [adults, kids, data.adult_price, data.kid_price]
  )

  const left = useMemo(
    () => data.places_left - adults - kids + (existingBookings ?? 0),
    [adults, kids, existingBookings, data.places_left]
  )

  return (
    <aside className={cn("rounded-2xl border-2 border-input_bg px-9 pb-7 pt-9", className)} {...rest}>
      <section>
        <h3 className="mb-2 text-xl font-bold">{data.title}</h3>
        <h4 className="mb-5 font-medium text-primary-gray">
          {"travel_agency" in data ? data.travel_agency.name : data.hike_agency.name}
        </h4>
        <div className="overflow-hidden rounded-lg">
          <Image
            src={data.photos[0]}
            width={361}
            height={200}
            alt={data.title + " resume photo"}
            className="aspect-[361/200] w-full object-cover"
          />
        </div>
      </section>

      <Separator className="my-8" />

      <section className="grid grid-cols-2 gap-4 font-medium">
        <div>
          <h5 className="block pb-1 text-sm text-light-gray">Departure date</h5>
          <p className="text-sm text-primary-gray">
            {DateTime.fromISO(data.departure_date).toFormat(`dd LLLL yyyy, HH:mm`)}
          </p>
        </div>
        <div>
          <h5 className="block pb-1 text-sm text-light-gray">Return date</h5>
          <p className="text-sm text-primary-gray">
            {DateTime.fromISO(data.return_date).toFormat(`dd LLLL yyyy, HH:mm`)}
          </p>
        </div>
      </section>

      <section className="mt-7 font-medium">
        <h5 className="pb-5 text-2xl font-medium">Pricing details</h5>
        <p className="flex items-center justify-between gap-4 pb-3">
          <span className="text-primary-gray">Adult price</span>
          <span>{formatPrice(data.adult_price)}</span>
        </p>
        <p className="flex items-center justify-between gap-4 pb-3">
          <span className="text-primary-gray">Kid Price</span>
          <span>{formatPrice(data.kid_price)}</span>
        </p>
        <p className="flex items-center justify-between gap-4 pb-3">
          <span className="text-primary-gray">Your bill</span>
          <span>{formatPrice(price)}</span>
        </p>
        <p className="flex items-center justify-between gap-4 pb-3">
          <span className="text-primary-gray">Additional Features</span>
          <span>{formatPrice(extra)}</span>
        </p>
        <p className="flex items-center justify-between gap-4 pb-5">
          <span className="text-primary-gray">Discount</span>
          <span>{formatPrice(discount)}</span>
        </p>
        <div className="flex items-center justify-between gap-4 rounded-lg bg-input_bg px-3 py-2">
          <h4>Total</h4>
          <span>{formatPrice(total ? total : extra + price)}</span>
        </div>
      </section>

      <div className="space-y-2 pt-6 text-center">
        {!hideSubmit && (
          <Button
            variant="primary"
            disabled={left < 0 || adults + kids === 0 || loading}
            className={cn("h-auto w-full rounded-lg px-6 py-3 text-lg")}
            type="submit"
          >
            {loading ? (
              <Spinner className="size-7 fill-primary-black text-white" />
            ) : data.places_left === 0 ? (
              "Fully booked !"
            ) : left < 0 ? (
              "Not enough places left !"
            ) : (
              "Proceed to payment"
            )}
          </Button>
        )}
        {paymentLink && (
          <Button
            variant="primary"
            disabled={isCancelLoading}
            className={cn("!block h-auto w-full px-0 py-0 text-lg")}
            type="button"
          >
            <Link href={paymentLink} className="block rounded-lg px-6 py-3">
              Pay now
            </Link>
          </Button>
        )}
        {updateLink && (
          <Button
            variant="primary"
            disabled={isCancelLoading}
            className={cn("!block h-auto w-full px-0 py-0 text-lg")}
            type="button"
          >
            <Link href={updateLink} className="block rounded-lg px-6 py-3">
              Update booking
            </Link>
          </Button>
        )}
        {returnUrl && (
          <Button variant="primary" className={cn("!block h-auto w-full px-0 py-0 text-lg")} type="button">
            <Link href={returnUrl} className="block rounded-lg px-6 py-3">
              Book another trip
            </Link>
          </Button>
        )}
        {cancelFn && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isCancelLoading}
                className={cn("h-auto w-full rounded-lg px-6 py-3 text-lg")}
                type="button"
              >
                {isCancelLoading ? <Spinner className="size-7 fill-primary-black text-white" /> : "Cancel booking"}
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
                  disabled={isCancelLoading}
                  onClick={cancelFn}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {!hidePlacesLeft && data.places_left <= PLACES_LEFT_LIMIT && data.places_left !== 0 && (
          <span className="block pt-2 text-sm text-error">Only {data.places_left} places left !</span>
        )}
      </div>
    </aside>
  )
}
