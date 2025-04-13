import { Button, Input, Label } from "@cfce/components/ui"
import { type ActionName, type TriggerName } from "@cfce/types"
import { useState, useEffect } from "react"
import type { Control } from "react-hook-form"
import { Controller, useFormContext } from "react-hook-form"
import type { HookFormValues } from "../types"

// Define the type for the form values
interface TransformParam {
  key: string
  value: string
}

export function TransformForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  const { setValue, getValues } = useFormContext<HookFormValues>()
  const [params, setParams] = useState<TransformParam[]>([])
  const [newParam, setNewParam] = useState<TransformParam>({ key: "", value: "" })

  // Initialize from existing parameters
  useEffect(() => {
    const existingParams = getValues(`actions.${index}.parameters`) as Record<string, string> || {}
    setParams(
      Object.entries(existingParams).map(([key, value]) => ({
        key,
        value: String(value)
      }))
    )
  }, [getValues, index])

  const updateFormValues = (newParams: TransformParam[]) => {
    const parameters = Object.fromEntries(
      newParams.map(({ key, value }) => [key, value])
    )
    setValue(`actions.${index}.parameters`, parameters)
  }

  const handleAddParam = () => {
    if (!newParam.key.trim()) return

    const updatedParams = [
      ...params.filter(p => p.key !== newParam.key),
      { ...newParam }
    ]
    setParams(updatedParams)
    updateFormValues(updatedParams)
    setNewParam({ key: "", value: "" })
  }

  const handleRemoveParam = (keyToRemove: string) => {
    const updatedParams = params.filter(p => p.key !== keyToRemove)
    setParams(updatedParams)
    updateFormValues(updatedParams)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Key</Label>
          <Input
            value={newParam.key}
            onChange={e => setNewParam({ ...newParam, key: e.target.value })}
            placeholder="Enter key"
          />
        </div>
        <div>
          <Label>Value</Label>
          <Input
            value={newParam.value}
            onChange={e => setNewParam({ ...newParam, value: e.target.value })}
            placeholder="Enter value"
          />
        </div>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddParam}
      >
        Add Transform
      </Button>

      {params.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Transforms</h4>
          <div className="space-y-2">
            {params.map(param => (
              <div
                key={param.key}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div>
                  <span className="font-medium">{param.key}</span>:{" "}
                  <span className="text-gray-600">{param.value}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveParam(param.key)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Controller
        control={control}
        name={`actions.${index}.parameters`}
        render={({ field }) => (
          <input
            type="hidden"
            {...field}
            value={JSON.stringify(Object.fromEntries(
              params.map(({ key, value }) => [key, value])
            ))}
          />
        )}
      />
    </div>
  )
}
