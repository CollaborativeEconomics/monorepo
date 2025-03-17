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

export function MathForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.inputA`}>Input A</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.inputA` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Can be a number or a path to a value in the context
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.inputB`}>Input B</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.inputB` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Can be a number or a path to a value in the context
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.operation`}>
          Operation
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.operation` as const}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={(field.value as string) || "add"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="subtract">Subtract</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="divide">Divide</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}
