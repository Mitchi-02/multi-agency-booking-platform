import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  reviews: number
  size?: 'sm' | 'md'
}

export default function Rating({ reviews, className, size, ...rest }: Props) {
  const full = Math.floor(reviews)
  const left = 5 - full - 1 >= 0 ? 5 - full - 1 : 0
  const extra = `0.${`${reviews}`.split(".")[1] ?? "0"}`

  return (
    <ul className={cn("flex gap-2", size==='sm' ? "scale-75" : "" , className)} {...rest} title={`${reviews}`}>
      {[...Array(full)].map((_, index) => (
        <li key={index}>
          <StarIcon className="text-[#FFC542]" />
        </li>
      ))}
      {extra !== "0.0" && (
        <li className="relative">
          <StarIcon className="text-primary-gray" />
          <span
            className="pointer-events-none absolute left-0 top-0 overflow-hidden"
            style={{ width: `calc(${extra} * 100%` }}
          >
            <StarIcon className="w-auto text-[#FFC542]" />
          </span>
        </li>
      )}
      {[...Array(left)].map((index) => (
        <li key={index + full}>
          <StarIcon className="text-primary-gray" />
        </li>
      ))}
    </ul>
  )
}
