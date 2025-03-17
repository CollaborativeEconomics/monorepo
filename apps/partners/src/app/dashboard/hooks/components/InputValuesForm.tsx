import { Button, Input, Label } from "@cfce/components/ui"
import type { ActionName, TriggerName } from "@cfce/types"
import { useState } from "react"
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

type InputValueType = "string" | "number" | "boolean" | "object" | "array"

interface InputValue {
  key: string
  type: InputValueType
  value: string | number | boolean | Record<string, unknown> | unknown[]
}

export function InputValuesForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  const [inputValues, setInputValues] = useState<InputValue[]>([])
  const [newKey, setNewKey] = useState("")
  const [newType, setNewType] = useState<InputValueType>("string")
  const [newValue, setNewValue] = useState("")

  // Get the current parameters
  const getParameters = () => {
    const parameters: Record<string, unknown> = {}
    for (const input of inputValues) {
      parameters[input.key] = input.value
    }
    return parameters
  }

  // Add a new input value
  const addInputValue = () => {
    if (!newKey.trim()) return

    let parsedValue:
      | string
      | number
      | boolean
      | Record<string, unknown>
      | unknown[] = newValue

    // Parse the value based on the selected type
    try {
      if (newType === "number") {
        parsedValue = Number(newValue)
      } else if (newType === "boolean") {
        parsedValue = newValue.toLowerCase() === "true"
      } else if (newType === "object") {
        parsedValue = JSON.parse(newValue)
      } else if (newType === "array") {
        parsedValue = JSON.parse(newValue)
      }
    } catch (error) {
      console.error("Error parsing value:", error)
      return
    }

    // Add the new input value
    const newInputValues = [
      ...inputValues,
      { key: newKey, type: newType, value: parsedValue },
    ]
    setInputValues(newInputValues)

    // Update the form field
    const parameters: Record<string, unknown> = {}
    for (const input of newInputValues) {
      parameters[input.key] = input.value
    }

    // Update the form values - safely access nested properties
    const actions = control._formValues.actions
    if (actions?.[index]) {
      actions[index].parameters = parameters
    }

    // Reset the input fields
    setNewKey("")
    setNewValue("")
  }

  // Remove an input value
  const removeInputValue = (indexToRemove: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== indexToRemove)
    setInputValues(newInputValues)

    // Update the form field
    const parameters: Record<string, unknown> = {}
    for (const input of newInputValues) {
      parameters[input.key] = input.value
    }

    // Update the form values - safely access nested properties
    const actions = control._formValues.actions
    if (actions?.[index]) {
      actions[index].parameters = parameters
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Key</Label>
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Enter key"
          />
        </div>
        <div>
          <Label>Type</Label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={newType}
            onChange={(e) => setNewType(e.target.value as InputValueType)}
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
            <option value="array">Array</option>
          </select>
        </div>
        <div>
          <Label>Value</Label>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={
              newType === "object"
                ? '{"key": "value"}'
                : newType === "array"
                  ? "[1, 2, 3]"
                  : newType === "boolean"
                    ? "true or false"
                    : "Enter value"
            }
          />
        </div>
      </div>

      <Button type="button" variant="outline" onClick={addInputValue}>
        Add Input
      </Button>

      {inputValues.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Inputs</h4>
          <div className="space-y-2">
            {inputValues.map((input) => (
              <div
                key={`input-${input.key}-${input.type}`}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div>
                  <span className="font-medium">{input.key}</span>:{" "}
                  <span className="text-gray-600">
                    {typeof input.value === "object"
                      ? JSON.stringify(input.value)
                      : String(input.value)}
                  </span>{" "}
                  <span className="text-xs text-gray-500">({input.type})</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeInputValue(
                      inputValues.findIndex(
                        (i) => i.key === input.key && i.type === input.type,
                      ),
                    )
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden field to store the parameters */}
      <Controller
        control={control}
        name={`actions.${index}.parameters`}
        render={({ field }) => (
          <input
            type="hidden"
            {...field}
            value={JSON.stringify(getParameters())}
          />
        )}
      />
    </div>
  )
}
