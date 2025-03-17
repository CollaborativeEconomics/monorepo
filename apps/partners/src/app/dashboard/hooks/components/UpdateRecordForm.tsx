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

export function UpdateRecordForm({
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
          ID of the document to update
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.data`}>Data</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.data` as const}
          render={({ field }) => (
            <Textarea
              {...field}
              value={
                typeof field.value === "object"
                  ? JSON.stringify(field.value, null, 2)
                  : (field.value as string) || ""
              }
              rows={5}
              placeholder="{}"
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          JSON object with fields to update
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.merge`}>Merge</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.merge` as const}
          render={({ field }) => (
            <Input
              type="checkbox"
              checked={field.value as boolean}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4"
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          If checked, merges data with existing document. Otherwise, replaces
          the document.
        </p>
      </div>
    </div>
  )
}
