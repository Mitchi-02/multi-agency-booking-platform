"use client"

import { SearchFormData } from "@/lib/types"
import { cn, emptyParam } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import Plane from "@/assets/icons/plane.svg"
import Mountain from "@/assets/icons/mountain.svg"
import { CaretDownIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DatePicker from "../DatePicker"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import NumberInput from "../NumberInput"

interface SearchFormProps extends React.HTMLAttributes<HTMLFormElement> {
  submit?: SubmitHandler<SearchFormData>
  page?: "hike" | "travel"
}

export default function SearchForm({ submit, className, page, ...props }: SearchFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { handleSubmit, setValue, register, watch } = useForm<SearchFormData>({
    defaultValues: {
      adults: searchParams.get("adults") ? Number(searchParams.get("adults")) : 1,
      kids: searchParams.get("kids") ? Number(searchParams.get("kids")) : 0,
      type: page ?? (searchParams.get("type") === "hike" ? "hike" : "travel"),
      open: searchParams.get("open") === "true" ? true : false,
      destination: searchParams.get("destination") || "",
      departure_date: searchParams.get("departure_date") || "",
      return_date: searchParams.get("return_date") || ""
    }
  })

  const defaultSubmit: SubmitHandler<SearchFormData> = (data) => {
    const paramsString = new URLSearchParams(
      emptyParam({
        destination: data.destination ?? "",
        departure_date: data.departure_date ?? "",
        return_date: data.return_date ?? "",
        adults: data.adults.toString(),
        kids: data.kids.toString()
      })
    ).toString()
    if (page !== data.type) {
      const url = data.type === "hike" ? "/hikes?" : "/travels?"
      return router.push(url + paramsString)
    }
    return router.push(`?${paramsString}`)
  }

  useEffect(() => {
    router.prefetch("/hikes")
    router.prefetch("/travels")
  }, [])

  return (
    <form
      {...props}
      onSubmit={handleSubmit(submit ?? defaultSubmit)}
      className={cn(
        "page-container page-container-xs relative flex gap-12 rounded-2xl bg-white px-16 py-8",
        "font-dm-sans shadow-[0px_12px_60px_0px_#59595910]",
        className
      )}
    >
      {(["adults", "kids", "type", "open"] as const).map((key) => (
        <input key={key} type="hidden" {...register(key)} />
      ))}
      <div className="grow">
        <div className="flex justify-between border-b-2 border-[#E7ECF3]">
          <div className="flex gap-7 text-sm font-bold">
            <button
              onClick={() => setValue("type", "travel")}
              className={cn(
                watch("type") === "travel"
                  ? "after:absolute after:top-full after:h-0.5 after:w-full after:bg-primary-blue"
                  : "text-primary-gray",
                "relative inline-flex items-center gap-2 pb-6"
              )}
              type="button"
            >
              <Plane className="stroke-current" />
              Travel
            </button>
            <button
              onClick={() => setValue("type", "hike")}
              className={cn(
                watch("type") === "travel"
                  ? "text-primary-gray"
                  : "after:absolute after:top-full after:h-0.5 after:w-full after:bg-primary-blue",
                "relative inline-flex items-center gap-2 pb-6"
              )}
              type="button"
            >
              <Mountain className="stroke-current" />
              Hike
            </button>
          </div>
          <button
            onClick={() => setValue("open", !watch("open"))}
            className={cn("relative inline-flex items-center gap-2 pb-6")}
            type="button"
          >
            {watch("kids") + watch("adults")} {watch("kids") + watch("adults") > 1 ? "Passengers" : "Passenger"}
            <CaretDownIcon className="stroke-current" />
          </button>
        </div>
        <div className="flex gap-2 pt-7">
          <Label
            htmlFor="destination"
            className="basis-2/5 cursor-pointer space-y-2 rounded-lg border border-[#E7ECF3] bg-[#F4F5F7] px-6 py-3 text-lg font-normal"
          >
            <span>Destination</span>
            <Input
              type="text"
              {...register("destination")}
              className="border-none bg-transparent p-0 text-base text-primary-gray shadow-none placeholder:text-gray-300"
              id="destination"
              placeholder="Dubai, United Arab Emirates"
            />
          </Label>
          <DatePicker
            date={watch("departure_date") ? new Date(watch("departure_date") ?? "") : undefined}
            setDate={(d) => {
              setValue("departure_date", !d ? undefined : `${d?.getFullYear()}-${d?.getMonth() + 1}-${d?.getDate()}`)
            }}
          >
            <div className="basis-[30%] space-y-2 rounded-lg border border-[#E7ECF3] bg-[#F4F5F7] px-6 py-3 text-lg">
              <Label className="text-lg font-normal">Check in</Label>
              <p className={cn(watch("departure_date") ? "text-primary-gray" : "text-gray-300")}>
                {watch("departure_date")
                  ? DateTime.fromFormat(watch("departure_date") ?? "", "yyyy-M-d").toLocaleString({
                      month: "long",
                      day: "numeric"
                    })
                  : DateTime.now().toLocaleString({
                      month: "long",
                      day: "numeric"
                    })}
              </p>
            </div>
          </DatePicker>
          <DatePicker
            date={watch("return_date") ? new Date(watch("return_date") ?? "") : undefined}
            setDate={(d) => {
              setValue("return_date", !d ? undefined : `${d?.getFullYear()}-${d?.getMonth() + 1}-${d?.getDate()}`)
            }}
          >
            <div className="basis-[30%] space-y-2 rounded-lg border border-[#E7ECF3] bg-[#F4F5F7] px-6 py-3 text-lg">
              <Label className="text-lg font-normal">Check out</Label>
              <p className={cn(watch("return_date") ? "text-primary-gray" : "text-gray-300")}>
                {watch("return_date")
                  ? DateTime.fromFormat(watch("return_date") ?? "", "yyyy-M-d").toLocaleString({
                      month: "long",
                      day: "numeric"
                    })
                  : DateTime.now().toLocaleString({
                      month: "long",
                      day: "numeric"
                    })}
              </p>
            </div>
          </DatePicker>
        </div>
      </div>
      <Button className="shrink-0 self-end" variant="primary" size="xl">
        Search
      </Button>
      {watch("open") && (
        <div className="absolute bottom-[calc(100%+10px)] right-0 w-[22rem] rounded-2xl bg-white px-7 py-3">
          <NumberInput
            value={watch("adults")}
            setValue={(d) => setValue("adults", d)}
            label="Adults"
            hint="Ages 13 or above"
          />
          <Separator className="my-3" />
          <NumberInput value={watch("kids")} setValue={(d) => setValue("kids", d)} label="Children" hint="Under 12" />
        </div>
      )}
    </form>
  )
}
