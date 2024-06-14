import { DetailedHTMLProps, HTMLAttributes } from "react"
import { TravelSuggestion } from "@/api/travel/types"
import { cn } from "@/lib/utils"
import { HikeSuggestion } from "@/api/hike/types"
import Suggestion from "./Suggestion"
import LoadingSuggestion from "./LoadingSuggestion"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  suggestions: TravelSuggestion[] | HikeSuggestion[]
  isLoading?: boolean
  title: string
  link: string
}

export default function SuggestionsSection({ suggestions, isLoading, title, link, className, ...rest }: Props) {
  const children = (
    <>
      {suggestions.map((s) => (
        <li key={s._id}>
          <Suggestion link={link} rating={"travel_agency" in s ? s.travel_agency : s.hike_agency} suggestion={s} />
        </li>
      ))}
    </>
  )
  const loading = (
    <>
      {[...Array(3)].map((_, i) => (
        <li key={i}>
          <LoadingSuggestion />
        </li>
      ))}
    </>
  )
  return (
    <section className={cn("", className)} {...rest}>
      <h5 className="pb-10 text-4xl font-bold">{title}</h5>
      <ul className="mb-4 grid grid-cols-3 gap-7">{isLoading ? loading : children}</ul>
    </section>
  )
}
