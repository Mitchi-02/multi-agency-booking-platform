"use client"

import { HikeDetails, HikeSuggestion } from "@/api/hike/types"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { CustomAxiosError } from "@/api/types"
import { getHikeDetails, getHikeSuggestions } from "@/api/hike"
import { useQuery } from "@tanstack/react-query"
import NotFound from "../global/NotFound"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Flag from "@/assets/icons/hikes-travels/flag.svg"
import Image from "next/image"
import Review from "../global/booking/Rating"
import { Separator } from "../ui/separator"
import AgencyCard from "../global/booking/AgencyCard"
import { SERVICES_ICONS } from "@/lib/constants/hikes"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import BookingCard from "./BookingCard"
import Plan from "../global/booking/Plan"
import ReviewsSection from "../global/booking/ReviewsSection"
import SuggestionsSection from "../global/booking/SuggestionsSection"
import { HikeReview } from "@/api/review/hike_review/types"
import { getHikeReviews } from "@/api/review/hike_review"

interface HikeCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  id: string
}

export default function HikePresentation({ id, className, ...props }: HikeCardProps) {
  const params = useSearchParams()

  const { error, data } = useQuery<any, CustomAxiosError, HikeDetails>({
    queryFn: () => getHikeDetails(id),
    queryKey: ["hikeDetails", id]
  })

  const {
    data: reviews,
    isLoading,
    isError: isErrorReviews
  } = useQuery<any, CustomAxiosError, HikeReview[]>({
    queryFn: () => getHikeReviews(data?.hike_agency._id ?? ""),
    queryKey: ["hikeReviews", id]
  })

  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    isError: isErrorSuggestions
  } = useQuery<any, CustomAxiosError, HikeSuggestion[]>({
    queryFn: () => getHikeSuggestions(data?.hike_agency._id ?? "", data?._id ?? ""),
    queryKey: ["hikeSuggestions", data?.hike_agency._id ?? "", data?._id ?? ""]
  })

  if (error?.response.status === 404 || !data) {
    return <NotFound />
  }

  return (
    <article className={cn("font-dm-sans", className)} {...props}>
      <section className="page-container page-container-sm">
        <h1 className="text-5xl font-medium">
          Let&apos;s visit {data.destination.split(",")[0] ?? data.destination} with {data.hike_agency.name} !
        </h1>
        <div className="flex items-center gap-10 pt-6 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <StarIcon className="text-[#FFC542]" />
            <span>
              {data.hike_agency.rating}{" "}
              <span className="text-primary-gray">({data.hike_agency.reviews_count} reviews)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="shrink-0" width={20} height={20} />
            <span className="truncate text-primary-gray">{data.destination}</span>
          </div>
        </div>
        <ul className="mt-10 grid aspect-[1240/632] grid-cols-3 grid-rows-3 gap-2 overflow-hidden rounded-3xl">
          <li className="relative col-span-2 row-span-3">
            <Image
              src={data.photos[0]}
              className="h-full w-full object-cover"
              alt={data.title + " photo"}
              width="756"
              height="632"
            />
          </li>
          {data.photos.slice(1).map((photo) => (
            <li key={photo}>
              <Image
                src={photo}
                className="h-full w-full object-cover"
                alt={data.title + " photo"}
                width="480"
                height="200"
              />
            </li>
          ))}
        </ul>
        <Review reviews={data.hike_agency.rating} className="pt-8" />
      </section>
      <section className="page-container page-container-sm flex items-start justify-between gap-10">
        <div className="max-w-[46rem] grow">
          <h2 className="pt-10 text-4xl font-medium">{data.title}</h2>
          <h3 className="pt-4 text-xl font-medium text-primary-gray">{data.destination}</h3>
          <Separator className="my-8" />
          <AgencyCard agency={data.hike_agency} />
          <p className="pt-10">{data.description}</p>
          <div className="pt-14">
            <h6 className="text-xl font-bold">Additional features</h6>
            <ul className="grid gap-5 pt-7 font-poppins">
              {data.complementary_services.map((service) => {
                const Icon = SERVICES_ICONS[service.type] || SERVICES_ICONS.default
                return (
                  <li key={service.name} className="flex items-center gap-3" title={service.name}>
                    <Icon width={24} height={24} />
                    <span>{service.name}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <BookingCard
          hike_id={data._id}
          className="min-w-[23rem]"
          kid_price={data.kid_price}
          return_date={data.return_date}
          discount={20000}
          places_left={data.places_left}
          services={data.complementary_services}
          adult_price={data.adult_price}
          departure_date={data.departure_date}
          kids={params.get("kids") ? Number(params.get("kids")) : 0}
          adults={params.get("adults") ? Number(params.get("adults")) : 1}
        />
      </section>

      <Plan steps={data.plan} className="page-container page-container-sm mt-20" title={"Hike Plan!"} />

      <Separator className="my-20" />

      {!isErrorReviews && reviews && reviews.length > 0 && (
        <ReviewsSection reviews={reviews ?? []} isLoading={isLoading} className="page-container page-container-xs" />
      )}

      {!isErrorSuggestions && suggestions && suggestions.length > 0 && (
        <SuggestionsSection
          link="/hikes"
          title="You may be interrested in these hikes too!"
          suggestions={suggestions ?? []}
          isLoading={isLoadingSuggestions}
          className="page-container page-container-sm mb-20 mt-20"
        />
      )}
    </article>
  )
}
