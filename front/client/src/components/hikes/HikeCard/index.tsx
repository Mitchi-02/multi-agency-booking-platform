import { Hike } from "@/api/hike/types"
import { calculatePrice, cn, formatPrice } from "@/lib/utils"
import Image from "next/image"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Calendar from "@/assets/icons/hikes-travels/calendar.svg"
import Bus from "@/assets/icons/hikes-travels/bus.svg"
import { DateTime } from "luxon"
import { Button } from "@/components/ui/button"
import { PLACES_LEFT_LIMIT, SERVICES_ICONS } from "@/lib/constants/hikes"
import AgencyIcon from "@/assets/icons/hikes-travels/agency.svg"
import Link from "next/link"

interface HikeCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  hike: Hike
  kids: number
  adults: number
  link: string
}

export default function HikeCard({ hike, className, kids, adults, link, ...props }: HikeCardProps) {
  const noPlace = hike.places_left < adults + kids
  return (
    <article
      className={cn(
        className,
        "flex max-h-[15.1rem] items-stretch overflow-hidden rounded-3xl bg-white font-dm-sans shadow-[0px_-1px_4px_0px_#E2E2EA40]"
      )}
      {...props}
    >
      <div className="shrink-0 basis-[30%]">
        <Image
          src={hike.photos[0]}
          alt={hike.title + " photo"}
          width={300}
          height={465}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="grow px-4 py-4">
        <h2 className="truncate pb-4 text-2xl font-bold" title={hike.destination}>
          {hike.destination}
        </h2>
        <div className="flex items-center gap-4 pb-6 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <StarIcon className="text-[#FFC542]" />
            <span>
              {hike.hike_agency.rating}{" "}
              <span className="text-primary-gray">({hike.hike_agency.reviews_count} reviews)</span>
            </span>
          </div>
          <div className="flex items-center gap-2" title={hike.hike_agency.name}>
            <AgencyIcon width={25} height={25} className="shrink-0" />
            <span className="truncate text-primary-gray">{hike.hike_agency.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar width={20} height={20} className="shrink-0 text-primary-gray" />
              <span>
                {DateTime.fromISO(hike.departure_date).toFormat("LLL dd")} {"-"}{" "}
                {DateTime.fromISO(hike.return_date).toFormat("LLL dd")}
              </span>
            </div>
            <div className="flex items-center gap-2" title={hike.departure_place}>
              <Bus className="shrink-0" />
              <span className="truncate">{hike.departure_place}</span>
            </div>
            <ul className="flex items-center gap-2">
              {hike.complementary_services.map((service) => {
                const Icon = SERVICES_ICONS[service.type] || SERVICES_ICONS.default
                return (
                  <li key={service.name} className="flex items-center gap-1" title={service.name}>
                    <Icon width={16} height={16} />
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 pb-2">
              <span className="text-lg font-bold">
                {formatPrice(calculatePrice(adults, kids, hike.adult_price, hike.kid_price))}
              </span>
              <span className="relative translate-y-1 text-sm font-medium text-primary-gray">For {adults + kids}</span>
            </div>
            <Button
              variant="primary"
              className={cn("h-auto rounded-[30px] p-0 text-base", noPlace && "bg-primary-gray")}
            >
              <Link href={link} className="block px-6 py-3">
                {noPlace ? "Check anyways" : "Book Now"}
              </Link>
            </Button>
            {hike.places_left <= PLACES_LEFT_LIMIT && !noPlace && (
              <p className="pt-2 text-sm text-error">Only {hike.places_left} places left !</p>
            )}
            {noPlace && (
              <p className="pt-2 text-center text-sm text-error">
                {hike.places_left === 0 ? "Fully booked" : `Only ${hike.places_left} places left`}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
