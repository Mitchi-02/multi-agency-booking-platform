import { DetailedHTMLProps, LiHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Rating from "../../Rating"
import { HikeReview } from "@/api/review/hike_review/types"
import { TravelReview } from "@/api/review/travel_review/types"
import { DateTime } from "luxon"
import DefaultPP from "@/assets/images/default_pp.png"

interface Props extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  review: TravelReview | HikeReview
}

export default function Review({ review, className, ...rest }: Props) {
  return (
    <li className={cn("rounded-2xl border border-input_bg bg-white px-7 py-5", className)} {...rest}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={review.user.profile_picture || DefaultPP}
            alt={`review of ${review.user.first_name} ${review.user.last_name}`}
            width={50}
            height={50}
            className="aspect-square rounded-full"
          />
          <div>
            <h6 className="font-medium">
              {review.user.first_name} {review.user.last_name}
            </h6>
            <span className="pr-4 text-sm text-primary-gray">{review.user.address}</span>
            <span className="text-xs text-light-gray">{review.user.reviews_count} reviews</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Rating reviews={review.rating} size="sm" />
          <span className="text-sm text-primary-gray">{DateTime.fromISO(review.createdAt).toISODate()}</span>
        </div>
      </header>
      <p className="pt-5 text-sm text-primary-gray">{review.comment}</p>
    </li>
  )
}
