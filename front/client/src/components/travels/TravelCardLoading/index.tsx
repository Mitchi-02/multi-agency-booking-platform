import { DetailedHTMLProps, HTMLAttributes } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TravelCardLoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
}

export default function TravelCardLoading({className, ...props }: TravelCardLoadingProps) {
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
        <div className="flex items-center gap-8 pb-8">
          <Skeleton className="h-8 max-w-[10rem] grow" />
          <Skeleton className="h-8 max-w-[10rem] grow" />
          <Skeleton className="h-8 max-w-[10rem] grow" />
        </div>
        <div className="grid max-w-[30rem] grid-cols-2 items-center gap-x-12 gap-y-4 pb-4">
          <Skeleton className="h-8 max-w-[15rem]" />
          <Skeleton className="h-8 max-w-[15rem]" />
          <Skeleton className="h-8 max-w-[15rem]" />
          <Skeleton className="h-8 max-w-[15rem]" />
        </div>
        <div className="flex items-center justify-end gap-4">
          <div>
            <Skeleton className="h-9 w-[8rem]" />
          </div>
          <Skeleton className="h-14 w-[10rem] !rounded-[30px]" />
        </div>
      </div>
    </article>
  )
}
