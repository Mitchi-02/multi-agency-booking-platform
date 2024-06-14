import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import React, { DetailedHTMLProps } from "react"
import MinusIcon from "@/assets/icons/minus.svg"
import PlusIcon from "@/assets/icons/plus.svg"

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: number
  setValue: (d: number) => void
  label: string
  hint: string
  min?: number
  max?: number
  disableAdd?: boolean
  disableMinus?: boolean
}

export default function NumberInput({
  value,
  setValue,
  min,
  max,
  className,
  disableAdd,
  disableMinus,
  label,
  hint,
  ...rest
}: Props) {
  const disabledMin = disableMinus ?? value <= (min ?? 0)
  const disabledAdd = disableAdd ?? value >= (max ?? 100)
  return (
    <div className={cn("flex items-center justify-between text-primary-gray", className)} {...rest}>
      <div>
        <Label className="text-base font-medium">{label}</Label>
        <p className="text-sm">{hint}</p>
      </div>
      <div className="font-sm flex items-center gap-3">
        <button
          type="button"
          disabled={disabledMin}
          onClick={() => setValue(value - 1)}
          className={cn(disabledMin ? "text-[#E6E8EC]" : "text-light-gray")}
        >
          <MinusIcon />
        </button>
        <span>{value}</span>
        <button
          type="button"
          disabled={disabledAdd}
          onClick={() => setValue(value + 1)}
          className={cn(disableAdd ? "text-[#E6E8EC]" : "text-light-gray")}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  )
}
