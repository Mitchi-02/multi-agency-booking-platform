import { Travel } from "@/api/travel/types"
import { calculatePrice, cn, formatPrice } from "@/lib/utils"
import Image from "next/image"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Calendar from "@/assets/icons/hikes-travels/calendar.svg"
import Location from "@/assets/icons/hikes-travels/location.svg"
import Flag from "@/assets/icons/hikes-travels/flag.svg"
import { DateTime } from "luxon"
import { Button } from "@/components/ui/button"
import { PLACES_LEFT_LIMIT, SERVICES_ICONS, TRANSPORT_ICONS } from "@/lib/constants/travels"
import AgencyIcon from "@/assets/icons/hikes-travels/agency.svg"
import Link from "next/link"

interface TravelCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  travel: Travel
  kids: number
  adults: number
  link: string
}

export default function TravelCard({ travel, link, className, kids, adults, ...props }: TravelCardProps) {
  const TransportIcon = TRANSPORT_ICONS[travel.transportation_type] || TRANSPORT_ICONS.other
  const noPlace = travel.places_left < adults + kids
  return (
    <article
      className={cn(
        className,
        "items-stretchen flex max-h-[19.2rem] overflow-hidden rounded-3xl bg-white font-dm-sans shadow-[0px_-1px_4px_0px_#E2E2EA40]"
      )}
      {...props}
    >
      <div className="shrink-0 basis-[30%]">
        <Image
          src={travel.photos[0]}
          alt={travel.title + " photo"}
          width={282}
          height={326}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="grow px-7 py-6">
        <h2 className="truncate pb-4 text-4xl font-bold" title={travel.title}>
          {travel.title}
        </h2>
        <div className="flex items-center gap-8 pb-8 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <StarIcon className="text-[#FFC542]" />
            <span>
              {travel.travel_agency.rating}{" "}
              <span className="text-primary-gray">({travel.travel_agency.reviews_count} reviews)</span>
            </span>
          </div>
          <div className="flex items-center gap-2" title={travel.destination}>
            <Flag className="shrink-0" />
            <span className="truncate text-primary-gray">{travel.destination}</span>
          </div>
          <div className="flex items-center gap-2" title={travel.travel_agency.name}>
            <AgencyIcon width={25} height={25} className="shrink-0" />
            <span className="truncate text-primary-gray">{travel.travel_agency.name}</span>
          </div>
        </div>
        <div className="grid grid-cols-[max-content_1fr] items-center gap-x-12 gap-y-4 pb-4">
          <div className="flex items-center gap-2">
            <Location className="shrink-0 text-primary-gray" />
            <span>{travel.hotel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar width={20} height={20} className="shrink-0 text-primary-gray" />
            <span>
              {DateTime.fromISO(travel.departure_date).toFormat("LLL dd yyyy")} {"-"}{" "}
              {DateTime.fromISO(travel.return_date).toFormat("LLL dd yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TransportIcon className="shrink-0" width={25} height={25} />
            <span>Departure from {travel.departure_place}</span>
          </div>
          <ul className="flex items-center gap-3">
            {travel.complementary_services.map((service) => {
              const Icon = SERVICES_ICONS[service.type] || SERVICES_ICONS.default
              return (
                <li key={service.name} className="flex items-center gap-1" title={service.name}>
                  <Icon width={16} height={16} />
                </li>
              )
            })}
          </ul>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="text-center">
            <span className="text-2xl font-bold">
              {formatPrice(calculatePrice(adults, kids, travel.adult_price, travel.kid_price))}
            </span>{" "}
            <span className="text-base font-medium text-primary-gray">For {adults + kids}</span>
            {travel.places_left <= PLACES_LEFT_LIMIT && !noPlace && (
              <p className="pt-1 text-center text-sm text-error">Only {travel.places_left} places left</p>
            )}
            {noPlace && (
              <p className="pt-1 text-center text-sm text-error">
                {travel.places_left === 0 ? "No places left" : `Only ${travel.places_left} places left`}
              </p>
            )}
          </div>
          <Button variant="primary" className={cn("h-auto rounded-[30px] p-0 text-lg", noPlace && "bg-primary-gray")}>
            <Link href={link} className="block px-8 py-4">
              {noPlace ? "Check anyways" : "Book Now"}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
