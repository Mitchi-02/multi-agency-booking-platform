import { AGENCY_CARD_OVERLAYS } from "@/lib/constants/hikes"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import Location from "@/assets/icons/hikes-travels/location.svg"
import Review from "../Rating"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  agency: {
    _id: string
    logo: string
    photos: string[]
    name: string
    rating: number
    address: string
  }
  overlay?: string
}

export default function AgencyCard({ className, overlay, agency, ...rest }: Props) {
  const bg = overlay ?? `${AGENCY_CARD_OVERLAYS[Math.floor(Math.random() * AGENCY_CARD_OVERLAYS.length)]}`

  return (
    <article className={cn("flex overflow-hidden rounded-2xl border border-input_bg", className)} {...rest}>
      <div className="relative basis-[40%]">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: bg
          }}
        >
          <Image
            src={agency.logo}
            alt={agency.name + " logo"}
            width={166}
            height={110}
            className="pointer-events-auto aspect-auto max-h-[95%] max-w-[90%] object-contain"
          />
        </div>
        <Image
          className="max-h-[9rem] w-full grow-0 object-cover"
          src={agency.photos[0]}
          alt={agency.name + " photo"}
          width={310}
          height={144}
        />
      </div>
      <div className="px-5 py-4">
        <h5 className="text-lg font-medium text-primary-gray">This trip is provided by</h5>
        <h4 className="pt-5 text-2xl font-medium">{agency.name}</h4>
        <div className="flex items-center gap-8 pt-2">
          <span className="flex items-center gap-2">
            <Location />
            <p>{agency.address}</p>
          </span>
          <Review reviews={agency.rating} />
        </div>
      </div>
    </article>
  )
}
