import { DetailedHTMLProps, LiHTMLAttributes } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Props extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {}

export default function LoadingReview({ className, ...rest }: Props) {
  return (
    <li className={cn("rounded-2xl border border-input_bg bg-white px-7 py-5", className)} {...rest}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="aspect-square w-[50px] !rounded-full" />
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mr-4 mt-1 inline-block h-4 w-48" />
            <Skeleton className="inline-block h-4 w-14" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </header>
      <Skeleton className="mt-5 h-14" />
    </li>
  )
}
