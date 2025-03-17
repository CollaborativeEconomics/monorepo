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

export function DeleteRecordForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.collectionPath`}>
          Collection Path
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.collectionPath` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Path to the collection in the database
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.documentId`}>
          Document ID
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.documentId` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          ID of the document to delete
        </p>
      </div>
    </div>
  )
}
