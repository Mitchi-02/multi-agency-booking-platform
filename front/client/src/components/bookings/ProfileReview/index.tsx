import { HikeReview } from "@/api/review/hike_review/types"
import { TravelReview } from "@/api/review/travel_review/types"
import Rating from "@/components/global/booking/Rating"
import { cn } from "@/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  review: TravelReview | HikeReview
}

export default function ProfileReview({ review, className, ...rest }: Props) {
  return (
    <div {...rest} className={cn("", className)}>
      <div className="flex items-center gap-10 pb-5">
        <h4 className="text-2xl font-bold">Your review</h4>
        <Rating reviews={review.rating} />
      </div>
      <p className="text-primary-gray">{review.comment}</p>
    </div>
  )
}
