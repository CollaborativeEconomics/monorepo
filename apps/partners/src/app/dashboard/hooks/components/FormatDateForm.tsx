import { Input, Label } from "@cfce/components/ui"
import { type ActionName, type TriggerName } from "@cfce/types"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"

// Define the type for the form values
interface HookFormValues {
  id?: string
  trigger: TriggerName
  description?: string
  actions: Array<{
    index: number
    key: string
    action: ActionName
    description?: string
    parameters: Record<string, unknown>
  }>
}

export function FormatDateForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.inputDate`}>
          Input Date
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.inputDate` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Date string, timestamp, or path to a date value in the context
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.format`}>Format</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.format` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Format string (e.g., "YYYY-MM-DD", "MM/DD/YYYY", etc.)
        </p>
      </div>
    </div>
  )
}
