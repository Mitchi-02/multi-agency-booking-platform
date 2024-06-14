import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { BaseFilter } from "@/api/types"
import { cn } from "@/lib/utils"
import { LabelProps } from "@radix-ui/react-label"

interface MultiSelectProps<T> extends React.HTMLAttributes<HTMLElement> {
  label?: string
  accessor: keyof T
  onUpdate?: (data: string[]) => void
  durations?: string[]
  isLoading?: boolean
  data: T[]
  max?: number
  labelProps?: LabelProps
  listStyle?: string
}

export default function MultiSelectFilter<T extends BaseFilter>({
  label,
  onUpdate,
  durations,
  isLoading,
  max,
  data,
  accessor,
  labelProps,
  listStyle,
  ...props
}: MultiSelectProps<T>) {
  const [values, setValues] = useState(durations ?? [])
  const [limit, setLimit] = useState(max ?? data.length)

  useEffect(() => {
    setValues(durations ?? [])
  }, [durations])
  const { className, ...rest } = labelProps ?? {}

  return (
    <section {...props}>
      {label && (
        <Label className={cn("block pb-5 text-lg font-medium", className)} {...(rest ?? {})}>
          {label}
        </Label>
      )}
      <ul className={cn("space-y-3", listStyle)}>
        {data.slice(0, limit).map((duration) => (
          <li key={duration.id} className="flex items-center gap-3 text-sm">
            <Checkbox
              className="h-6 w-6 rounded-lg "
              id={duration.id}
              disabled={isLoading}
              checked={values.includes(duration[accessor] as string)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValues((prev) => {
                    const temp = [...prev, duration[accessor] as string]
                    onUpdate?.(temp)
                    return temp
                  })
                } else {
                  setValues((prev) => {
                    const temp = prev.filter((v) => v !== duration[accessor])
                    onUpdate?.(temp)
                    return temp
                  })
                }
              }}
            />
            <label htmlFor={duration.id} className="capitalize">
              {duration.name}
            </label>
            {duration.extra && (
              <span
                className={cn(
                  "ml-auto font-medium",
                  values.includes(duration[accessor] as string) ? "text-primary-black" : "text-primary-gray"
                )}
              >
                {duration.extra}
              </span>
            )}
          </li>
        ))}
      </ul>
      {max && limit !== data.length && (
        <Button
          onClick={() => setLimit(data.length)}
          className="mt-3 px-0 text-base font-medium text-primary-blue"
          variant={"link"}
        >
          See More
        </Button>
      )}
      {max && limit === data.length && (
        <Button
          onClick={() => setLimit(max)}
          className="mt-3 px-0 text-base font-medium text-primary-blue"
          variant={"link"}
        >
          See Less
        </Button>
      )}
    </section>
  )
}
