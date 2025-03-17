import { Input, Label, Textarea } from "@cfce/components/ui"
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

export function SendEmailForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.to`}>To</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.to` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Email address of the recipient
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.subject`}>Subject</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.subject` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.body`}>Body</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.body` as const}
          render={({ field }) => (
            <Textarea
              {...field}
              value={(field.value as string) || ""}
              rows={5}
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Email body content (supports HTML)
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.from`}>
          From (Optional)
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.from` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Sender email address (if different from default)
        </p>
      </div>
    </div>
  )
}
