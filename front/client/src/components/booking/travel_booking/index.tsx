"use client"

import { TravelDetails } from "@/api/travel/types"
import { DetailedHTMLProps, HTMLAttributes, useCallback } from "react"
import { CustomAxiosError, SuccessResponse } from "@/api/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import NotFound from "../../global/NotFound"
import { cn, initBooking } from "@/lib/utils"
import { getTravelDetails } from "@/api/travel"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "../../ui/separator"
import { BookingSchema } from "@/lib/schemas/booking"
import { BookingFormData, BookingSchemaType } from "@/lib/types/booking"
import { CompleteTravelBooking } from "@/api/booking/travel_booking/types"
import { bookTravel } from "@/api/booking/travel_booking"
import { toast } from "react-toastify"
import Person from "../Person"
import PlusIcon from "@/assets/icons/plus.svg"
import ResumeCard from "../ResumeCard"
import queryClient from "@/lib/queryClient"
import { useRouter } from "next/navigation"
import { BookingType, SingleBookingPost } from "@/api/booking/types"

interface TravelBookingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
  booking: BookingFormData
}

export default function TravelBooking({ id, booking, className, ...props }: TravelBookingProps) {
  const router = useRouter()
  const { error, data } = useQuery<any, CustomAxiosError, TravelDetails>({
    queryFn: () => getTravelDetails(id),
    queryKey: ["travelDetails", id]
  })

  const { mutate, isPending } = useMutation<
    SuccessResponse<CompleteTravelBooking>,
    CustomAxiosError,
    SingleBookingPost[]
  >({
    mutationFn: (d) => bookTravel(id, d),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: (res) => {
      toast.success("Booking successful")
      router.push(`/travels/${id}/booking/${res.data.data._id}/checkout`)
      queryClient.invalidateQueries({
        queryKey: ["travelDetails", id]
      })
    },
    mutationKey: ["travelBooking", id]
  })

  const defaultServices = data?.complementary_services
    .filter((s) => booking.services.includes(s.name))
    .map((s) => s.name)

  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    register,
    formState: { errors }
  } = useForm<BookingSchemaType>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      adults: initBooking(booking?.adults ?? 1, defaultServices),
      kids: initBooking(booking?.kids ?? 0, defaultServices)
    }
  })

  const extraAdults = useCallback(() => {
    if (!data?.complementary_services) return 0
    return Object.values(watch("adults")).reduce((acc, item) => {
      return (
        acc +
        data.complementary_services
          .filter((s) => item?.chosen_services.includes(s.name))
          .reduce((acc, service) => {
            return acc + service.price
          }, 0)
      )
    }, 0)
  }, [data?.complementary_services])

  const extraKids = useCallback(() => {
    if (!data?.complementary_services) return 0
    return Object.values(watch("kids")).reduce((acc, item) => {
      return (
        acc +
        data.complementary_services
          .filter((s) => item?.chosen_services.includes(s.name))
          .reduce((acc, service) => {
            return acc + service.price
          }, 0)
      )
    }, 0)
  }, [data?.complementary_services])

  const onSubmit: SubmitHandler<BookingSchemaType> = (d) => {
    mutate(
      Object.values(d.adults)
        .map((s) => {
          return {
            ...s,
            type: "adult" as BookingType
          }
        })
        .concat(
          Object.values(d.kids).map((s) => {
            return {
              ...s,
              type: "kid" as BookingType
            }
          })
        )
    )
  }

  if (error?.response?.status === 404 || !data) {
    return <NotFound />
  }

  return (
    <section className={cn("page-container page-container-sm pb-20 font-dm-sans", className)} {...props}>
      <h1 className="mb-6 text-4xl font-medium">Complete your booking</h1>
      <form className="flex items-start gap-20" onSubmit={handleSubmit(onSubmit)}>
        <div className="grow">
          <Separator className="mb-10" />
          <section>
            <div className="flex items-center justify-between gap-4 pb-6">
              <h2 className="text-2xl font-medium">Adults</h2>
              <button
                type="button"
                disabled={false}
                onClick={() => {
                  setValue("adults", {
                    ...getValues("adults"),
                    [Object.keys(getValues("adults")).length]: {
                      full_name: "",
                      phone: "",
                      chosen_services: []
                    }
                  })
                }}
                className={cn(false ? "text-[#E6E8EC]" : "text-light-gray")}
              >
                <PlusIcon />
              </button>
            </div>

            <ul className="space-y-5">
              {Object.values(watch("adults")).map((_, i) => (
                <li key={i}>
                  <Person
                    deletable={i > 0}
                    registerName={register(`adults.${i}.full_name`)}
                    registerPhone={register(`adults.${i}.phone`)}
                    registerServices={register(`adults.${i}.chosen_services`)}
                    selected_services={watch(`adults.${i}.chosen_services`)}
                    setServices={(v) => setValue(`adults.${i}.chosen_services`, v)}
                    errors={errors?.adults?.[i]}
                    index={i}
                    services={data.complementary_services ?? []}
                    onDelete={() => {
                      const adults = Object.values(watch("adults"))
                      setValue(
                        "adults",
                        adults.reduce((acc, item, index) => {
                          if (index === i) return acc
                          return {
                            ...acc,
                            [index]: item
                          }
                        }, {})
                      )
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
          <section className="pt-10">
            <div className="flex items-center justify-between gap-4 pb-6">
              <h2 className="text-2xl font-medium">Kids</h2>
              <button
                type="button"
                disabled={false}
                onClick={() => {
                  setValue("kids", {
                    ...getValues("kids"),
                    [Object.keys(getValues("kids")).length]: {
                      full_name: "",
                      phone: "",
                      chosen_services: []
                    }
                  })
                }}
                className={cn(false ? "text-[#E6E8EC]" : "text-light-gray")}
              >
                <PlusIcon />
              </button>
            </div>{" "}
            <ul className="space-y-5">
              {Object.values(watch("kids")).length === 0 ? (
                <span className="text-primary-gray">No kids added</span>
              ) : (
                Object.values(watch("kids")).map((_, i) => (
                  <li key={i}>
                    <Person
                      errors={errors?.kids?.[i]}
                      deletable={true}
                      registerName={register(`kids.${i}.full_name`)}
                      registerPhone={register(`kids.${i}.phone`)}
                      registerServices={register(`kids.${i}.chosen_services`)}
                      selected_services={watch(`kids.${i}.chosen_services`)}
                      setServices={(v) => setValue(`kids.${i}.chosen_services`, v)}
                      index={i + Object.values(watch("kids")).length}
                      services={data.complementary_services ?? []}
                      onDelete={() => {
                        const kids = Object.values(watch("kids"))
                        setValue(
                          "kids",
                          kids.reduce((acc, item, index) => {
                            if (index === i) return acc
                            return {
                              ...acc,
                              [index]: item
                            }
                          }, {})
                        )
                      }}
                    />
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
        <ResumeCard
          loading={isPending}
          className="shrink-0 basis-[27rem]"
          data={data}
          kids={Object.keys(watch("kids")).length}
          adults={Object.keys(watch("adults")).length}
          discount={20000}
          extra={extraAdults() + extraKids()}
        />
      </form>
    </section>
  )
}
