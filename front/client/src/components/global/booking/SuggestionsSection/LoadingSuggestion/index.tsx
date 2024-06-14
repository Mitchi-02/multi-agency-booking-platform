import { DetailedHTMLProps, LiHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Props extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {}

export default function LoadingSuggestion({ className, ...rest }: Props) {
  return (
    <article className={cn("rounded-2xl border border-input_bg bg-white p-5", className)} {...rest}>
      <Skeleton className="aspect-[330/200] !rounded-lg" />
      <section className="mt-5 font-medium">
        <Skeleton className="mb-2 h-5 w-40" />
        <Skeleton className="h-4 w-32" />
      </section>
    </article>
  )
}
