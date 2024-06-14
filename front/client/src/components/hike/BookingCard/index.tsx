import { HikeComplementaryService } from "@/api/hike/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BookingFormData } from "@/lib/types/booking"
import { calculatePrice, cn, emptyParam, formatPrice } from "@/lib/utils"
import { DateTime } from "luxon"
import { DetailedHTMLProps, FormHTMLAttributes, useMemo } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import CalendarIcon from "@/assets/icons/hikes-travels/calend.svg"
import NumberInput from "@/components/global/booking/NumberInput"
import MultiSelectFilter from "@/components/global/booking/Filters/MultiSelectFilter"
import { Button } from "@/components/ui/button"
import { PLACES_LEFT_LIMIT } from "@/lib/constants/hikes"
import { useRouter } from "next/navigation"

interface Props extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  services: HikeComplementaryService[]
  kids: number
  adults: number
  discount: number
  departure_date: string
  adult_price: number
  return_date: string
  kid_price: number
  places_left: number
  hike_id: string
}

export default function BookingCard({
  services,
  kids,
  adult_price,
  adults,
  departure_date,
  discount,
  kid_price,
  className,
  places_left,
  return_date,
  hike_id,
  ...rest
}: Props) {
  const { handleSubmit, setValue, watch, register } = useForm<BookingFormData>({
    defaultValues: {
      adults: adults,
      kids: kids,
      services: []
    }
  })
  const router = useRouter()

  const price = useMemo(
    () => calculatePrice(watch("adults"), watch("kids"), adult_price, kid_price),
    [watch("adults"), watch("kids")]
  )

  const left = useMemo(() => places_left - watch("adults") - watch("kids"), [watch("adults"), watch("kids")])

  const servicesPrice = useMemo(
    () =>
      services
        .filter((s) => watch("services").includes(s.name))
        .reduce((acc, service) => {
          return acc + service.price
        }, 0),
    [watch("services"), services]
  )

  const onSubmit: SubmitHandler<BookingFormData> = (data) => {
    const paramsString = new URLSearchParams(
      emptyParam({
        services: data.services.join("_"),
        adults: data.adults.toString(),
        kids: data.kids.toString()
      })
    ).toString()
    return router.push(`/hikes/${hike_id}/booking?` + paramsString)
  }

  const sameYear = DateTime.fromISO(departure_date).year === DateTime.fromISO(return_date).year

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("rounded-2xl border border-input_bg px-10 py-6", className)}
      {...rest}
    >
      {(["adults", "kids", "services"] as const).map((key) => (
        <input key={key} type="hidden" {...register(key)} />
      ))}
      <span className="block text-center text-3xl font-bold">{formatPrice(price)}</span>
      <Separator className="mb-8 mt-4" />
      <div className="pb-6">
        <Label htmlFor="departure_date" className="block pb-2 text-base font-medium text-primary-gray">
          Trip date
        </Label>
        <div className="flex items-center rounded-lg border border-[#E7ECF3] bg-[#F4F5F7] px-4 py-3">
          <Input
            type="text"
            disabled={true}
            value={
              DateTime.fromISO(departure_date).toFormat(`dd LLLL${!sameYear ? " yyyy, " : ", "}`) +
              DateTime.fromISO(return_date).toFormat(`dd LLLL yyyy`)
            }
            className="border-none bg-transparent p-0 text-sm !text-primary-black shadow-none"
            id="departure_date"
          />
          <CalendarIcon className="shrink-0" />
        </div>
      </div>

      <NumberInput
        disableAdd={left <= 0}
        value={watch("adults")}
        setValue={(d) => setValue("adults", d)}
        label="Adults"
        hint="Ages 13 or above"
        className="pb-6"
      />

      <NumberInput
        disableAdd={left <= 0}
        className="pb-6"
        value={watch("kids")}
        setValue={(d) => setValue("kids", d)}
        label="Children"
        hint="Under 12"
      />

      <MultiSelectFilter
        labelProps={{
          className: "text-primary-gray pb-3"
        }}
        accessor="id"
        data={services.map((s) => ({
          id: s.name,
          name: s.name,
          extra: formatPrice(s.price)
        }))}
        label="Additional features"
        isLoading={false}
        onUpdate={(d) => {
          setValue("services", d)
        }}
        durations={watch("services")}
      />

      <div className="mt-6">
        <Label htmlFor="departure_date" className="block pb-2 text-base font-medium text-primary-gray">
          Price
        </Label>
        <section className="space-y-3 rounded-lg bg-input_bg px-5 py-3 text-sm">
          <p className="flex items-center justify-between gap-4">
            <span>Adult price</span>
            <span>{formatPrice(adult_price)}</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Kid Price</span>
            <span>{formatPrice(kid_price)}</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Your bill</span>
            <span>{formatPrice(price)}</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Additional Features</span>
            <span>{formatPrice(servicesPrice)}</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Discount</span>
            <span>{formatPrice(discount)}</span>
          </p>
        </section>
      </div>
      <div className="flex items-center justify-between gap-4 pt-6 font-medium">
        <Label htmlFor="departure_date" className="block pb-2 text-base font-medium text-primary-gray">
          Total payment
        </Label>
        <span>{formatPrice(servicesPrice + price)}</span>
      </div>

      <div className="pt-6 text-center">
        <Button
          variant="primary"
          disabled={left < 0 || watch("adults") + watch("kids") === 0}
          className={cn("h-auto w-full rounded-lg px-6 py-3 text-lg")}
          type="submit"
        >
          {places_left === 0 ? "Fully booked !" : left < 0 ? "Not enough places left !" : "Book Now"}
        </Button>
        {places_left <= PLACES_LEFT_LIMIT && places_left !== 0 && (
          <span className="block pt-2 text-sm text-error">Only {places_left} places left !</span>
        )}
      </div>
    </form>
  )
}
