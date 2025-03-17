import { Input, Label } from "@cfce/components/ui"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"

// Define the type for the form values
interface HookFormValues {
  id?: string
  trigger: string
  description?: string
  actions: Array<{
    index: number
    key: string
    action: string
    description?: string
    parameters: Record<string, unknown>
  }>
}

export function CreateStoriesForm({
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
        <Label htmlFor={`actions.${index}.parameters.storyPath`}>
          Story Path
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.storyPath` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Path to the stories data in the context object
        </p>
      </div>
    </div>
  )
}
