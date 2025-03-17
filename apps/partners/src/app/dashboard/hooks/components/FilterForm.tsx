import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cfce/components/ui"
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

export function FilterForm({
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
          Path to the collection in the context object
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.key`}>Key</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.key` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          The property key to compare against
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.value`}>Value</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.value` as const}
          render={({ field }) => (
            <Input {...field} value={String(field.value) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          The value to compare against
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.operator`}>Operator</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.operator` as const}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={(field.value as string) || "==="}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="===">Equals (===)</SelectItem>
                <SelectItem value="!==">Not Equals (!==)</SelectItem>
                <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                <SelectItem value="<">Less Than (&lt;)</SelectItem>
                <SelectItem value=">=">
                  Greater Than or Equal (&gt;=)
                </SelectItem>
                <SelectItem value="<=">Less Than or Equal (&lt;=)</SelectItem>
                <SelectItem value="&&">AND (&&)</SelectItem>
                <SelectItem value="||">OR (||)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}
