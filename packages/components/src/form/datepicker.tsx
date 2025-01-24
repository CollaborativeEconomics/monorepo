import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

import { cn } from "~/shadCnUtil"
import { Button } from "~/ui"
import { Calendar } from "~/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"

interface DatePickerProps {
  register?: UseFormRegisterReturn
  label?: string
}

export function DatePicker({
  register,
  label = "Pick a date",
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (register?.onChange) {
      register.onChange({
        target: { value: selectedDate },
        type: "change",
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          {...register} // Spread register props here
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  )
}
