import { DetailedHTMLProps, LiHTMLAttributes } from "react"
import { TravelSuggestion } from "@/api/travel/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { HikeSuggestion } from "@/api/hike/types"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Link from "next/link"

interface Props {
  suggestion: TravelSuggestion | HikeSuggestion
  link: string
  rating: {
    rating: number
    reviews_count: number
  }
  className?: string
}

export default function Suggestion({ suggestion, rating, link, className }: Props) {
  return (
    <Link
      href={`${link}/${suggestion._id}`}
      className={cn("block rounded-2xl border border-input_bg bg-white p-5", className)}
    >
      <div className="flex items-center gap-3 overflow-hidden rounded-lg">
        <Image
          src={suggestion.photos[0]}
          alt={`suggestion of ${suggestion.destination}`}
          width={330}
          height={240}
          className="aspect-[330/240] w-full object-cover"
        />
      </div>
      <section className="mt-5 font-medium">
        <h6 className="pb-2 text-xl">{suggestion.destination}</h6>
        <div className="flex items-center gap-2 font-medium">
          <StarIcon className="text-[#FFC542]" />
          <span className="text-sm text-primary-gray">
            {rating.rating} ({rating.reviews_count} reviews)
          </span>
        </div>
      </section>
    </Link>
  )
}
