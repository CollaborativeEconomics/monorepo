import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
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

export function FetchDataFromApiForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.endpoint`}>
          Endpoint URL
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.endpoint` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Full URL of the API endpoint
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.method`}>Method</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.method` as const}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={(field.value as string) || "GET"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.body`}>
          Body (for POST, PUT, PATCH)
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.body` as const}
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
          JSON body to send with the request
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.headers`}>Headers</Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.headers` as const}
          render={({ field }) => (
            <Textarea
              {...field}
              value={
                typeof field.value === "object"
                  ? JSON.stringify(field.value, null, 2)
                  : (field.value as string) || ""
              }
              rows={3}
              placeholder='{"Content-Type": "application/json"}'
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          JSON object with request headers
        </p>
      </div>
      <div>
        <Label htmlFor={`actions.${index}.parameters.resultPath`}>
          Result Path (Optional)
        </Label>
        <Controller
          control={control}
          name={`actions.${index}.parameters.resultPath` as const}
          render={({ field }) => (
            <Input {...field} value={(field.value as string) || ""} />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Path to store the result in the context (e.g., "data.apiResult")
        </p>
      </div>
    </div>
  )
}
