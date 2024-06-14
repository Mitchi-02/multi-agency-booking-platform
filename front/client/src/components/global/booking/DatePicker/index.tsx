"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerProps = {
  children: React.ReactNode
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export default function DatePicker({ children, date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  )
}
