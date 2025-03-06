"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import { cn } from "~/shadCnUtil"
import { Button } from "~/ui/button"
import { Calendar } from "~/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"

interface DatePickerProps {
  label: string
  value?: Date
  onChange: (date: Date) => void
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{label ?? "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          required
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
