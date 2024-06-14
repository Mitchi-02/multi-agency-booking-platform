import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { formatPrice } from "@/lib/utils"

interface PriceRangeProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  onUpdate?: (value: (number | undefined)[]) => void
  min_value?: string
  max_value?: string
  id: string
  isLoading?: boolean
}

const min = 3000
const max = 500000
const step = 3000

export default function PriceRange({
  label,
  onUpdate,
  min_value,
  max_value,
  id,
  isLoading,
  ...props
}: PriceRangeProps) {
  const [maxValue, setMaxValue] = useState(max_value ? Number(max_value) : max)
  const [minValue, setMinValue] = useState(min_value ? Number(min_value) : min)

  useEffect(() => {
    setMaxValue(max_value ? Number(max_value) : max)
  }, [max_value])

  useEffect(() => {
    setMinValue(min_value ? Number(min_value) : min)
  }, [min_value])

  return (
    <section {...props}>
      <Label htmlFor={id} className="text-lg font-medium">
        {label}
        <div className="px-3">
          <Slider
            disabled={isLoading}
            minStepsBetweenThumbs={1}
            min={min}
            max={max}
            step={step}
            formatLabel={(value) => formatPrice(value, true)}
            className="mt-10 grow"
            value={[minValue, maxValue]}
            onValueChange={(values) => {
              setMinValue(values[0])
              setMaxValue(values[1])
              onUpdate &&
                onUpdate([values[0] === min ? undefined : values[0], values[1] === max ? undefined : values[1]])
            }}
          />
        </div>
        <div className="flex justify-between pt-5 font-medium">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </div>
      </Label>
    </section>
  )
}
