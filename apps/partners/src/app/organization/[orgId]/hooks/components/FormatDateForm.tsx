import { Input, Label } from "@cfce/components/ui"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { HookFormValues } from "../types"
import type { ActionToParamsMap } from "@cfce/types"

type FormatDateFormProps = {
  control: Control<HookFormValues>
  index: number
}

type DateField = {
  id: string
  label: string
  description: string
}

const DATE_FIELDS: DateField[] = [
  {
    id: "inputDate",
    label: "Input Date",
    description: "Date string, timestamp, or path to a date value in the context",
  },
  {
    id: "format",
    label: "Format",
    description: 'Format string (e.g., "YYYY-MM-DD", "MM/DD/YYYY", etc.)',
  },
]

export function FormatDateForm({ control, index }: FormatDateFormProps) {
  return (
    <div className="space-y-4">
      {DATE_FIELDS.map(({ id, label, description }) => (
        <div key={id}>
          <Label htmlFor={`actions.${index}.parameters.${id}`}>{label}</Label>
          <Controller
            control={control}
            name={`actions.${index}.parameters.${id}`}
            render={({ field: { value, onChange, ...field } }) => (
              <Input
                {...field}
                value={String(value || "")}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      ))}
    </div>
  )
}
