import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface HikeCardLoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function HikeCardLoading({ className, ...props }: HikeCardLoadingProps) {
  return (
    <article
      className={cn(
        className,
        "items-stretchen flex overflow-hidden rounded-3xl bg-white shadow-[0px_-1px_4px_0px_#E2E2EA80]"
      )}
      {...props}
    >
      <div className="shrink-0 basis-[30%]">
        <Skeleton className="h-full !rounded-none" />
      </div>
      <div className="grow px-7 py-6">
        <Skeleton className="mb-4 h-12" />
        <div className="flex items-center gap-8 pb-6">
          <Skeleton className="h-8 max-w-[10rem] grow" />
          <Skeleton className="h-8 max-w-[10rem] grow" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[10rem]" />
            <Skeleton className="h-6 w-[10rem]" />
            <Skeleton className="h-6 w-[10rem]" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-[4rem] mx-auto" />
            <Skeleton className="h-10 w-[6rem] !rounded-[30px] mx-auto" />
          </div>
        </div>
      </div>
    </article>
  )
}
