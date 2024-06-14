import { DetailedHTMLProps, HTMLAttributes } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface BookingCardLoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function BookingCardLoading({ className, ...props }: BookingCardLoadingProps) {
  return (
    <article
      className={cn(
        className,
        "items-stretchen flex overflow-hidden rounded-3xl bg-white shadow-[0px_-1px_4px_0px_#E2E2EA80]"
      )}
      {...props}
    >
      <Skeleton className="h-[10rem] w-full" />
    </article>
  )
}
