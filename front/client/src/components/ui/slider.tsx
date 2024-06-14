"use client"

import { Fragment, forwardRef } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export type SliderProps = {
  className?: string
  min: number
  max: number
  minStepsBetweenThumbs: number
  step: number
  disabled?: boolean
  formatLabel?: (value: number) => string
  value?: number[]
  onValueChange?: (values: number[]) => void
}

const Slider = forwardRef(
  ({ className, min, max, step, formatLabel, value, onValueChange, ...props }: SliderProps, ref) => {
    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-input_bg">
          <SliderPrimitive.Range className="absolute h-full bg-primary-blue" />
        </SliderPrimitive.Track>
        {value?.map((value, index) => (
          <Fragment key={index}>
            <SliderPrimitive.Thumb className="block h-5 w-5 cursor-grab rounded-full border-4 border-white bg-primary-blue shadow transition-colors focus-visible:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
              <div className="absolute -top-8 left-1/2 z-30 -translate-x-1/2 transform rounded-md bg-[#0B2541] p-2 text-xs text-white">
                {formatLabel ? formatLabel(value) : value}
              </div>
            </SliderPrimitive.Thumb>
          </Fragment>
        ))}
      </SliderPrimitive.Root>
    )
  }
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
