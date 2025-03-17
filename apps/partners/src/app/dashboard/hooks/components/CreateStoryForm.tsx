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

export function CreateStoryForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.organizationId`}>
          Organization ID
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.organizationId` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.initiativeId`}>
          Initiative ID
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.initiativeId` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.name`}>Name</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.name` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.description`}>
          Description
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.description` as const}
          render={({ field }) => (
            <Textarea {...field} value={(field.value as string) || ""} />
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.image`}>Image URL</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.image` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.amount`}>
          Amount (optional)
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.amount` as const}
          render={({ field }) => (
            <Input
              type="number"
              {...field}
              value={(field.value as number) || 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </div>
    </div>
  )
}
