import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import Review from "./Review"
import LoadingReview from "./LoadingReview"
import { TravelReview } from "@/api/review/travel_review/types"
import { HikeReview } from "@/api/review/hike_review/types"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  reviews: TravelReview[] | HikeReview[]
  isLoading?: boolean
}

export default function ReviewsSection({ reviews, isLoading, className, ...rest }: Props) {
  const children = (
    <>
      {reviews.map((r) => (
        <Review review={r} key={r._id} />
      ))}
    </>
  )
  const loading = (
    <>
      {[...Array(3)].map((_, i) => (
        <LoadingReview key={i} />
      ))}
    </>
  )

  return (
    <section className={cn("", className)} {...rest}>
      <h5 className="pb-6 text-2xl font-bold">Latest reviews</h5>
      <ul className="space-y-3">{isLoading ? loading : children}</ul>
    </section>
  )
}
