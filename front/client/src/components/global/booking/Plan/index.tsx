import { DetailedHTMLProps, HTMLAttributes } from "react"
import { TravelPlanStep } from "@/api/travel/types"
import { cn } from "@/lib/utils"
import { HikePlanStep } from "@/api/hike/types"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  steps: TravelPlanStep[] | HikePlanStep[]
  title: string
}

export default function Plan({ steps, className, title, ...rest }: Props) {
  return (
    <section className={cn("rounded-2xl bg-[#F4F5F7] px-20 py-10", className)} {...rest}>
      <h3 className="pb-7 text-4xl font-bold">{title}</h3>
      <ol className="space-y-5">
        {steps.map((s, index) => (
          <li key={s.title} className="rounded-xl border border-[#E7ECF3] bg-white px-6 py-8">
            <h6 className="pb-3 text-2xl font-medium">
              {index + 1}. {s.title}
            </h6>
            <p className="text-sm text-primary-gray">{s.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
