import { Button, Input, Label } from "@cfce/components/ui"
import type { InputValuesParameters } from "@cfce/types"
import { useState } from "react"
import type { Control } from "react-hook-form"
import { Controller, useFormContext } from "react-hook-form"
import type { HookFormValues } from "../types"

type InputValueType = "string" | "number" | "boolean" | "object" | "array"

interface InputValue {
  key: string
  type: InputValueType
  value: InputValuesParameters[keyof InputValuesParameters]
}

const INPUT_TYPES: { value: InputValueType; label: string; placeholder: string }[] = [
  { value: "string", label: "String", placeholder: "Enter value" },
  { value: "number", label: "Number", placeholder: "Enter number" },
  { value: "boolean", label: "Boolean", placeholder: "true or false" },
  { value: "object", label: "Object", placeholder: '{"key": "value"}' },
  { value: "array", label: "Array", placeholder: "[1, 2, 3]" }
]

const parseInputValue = (value: string, type: InputValueType): InputValuesParameters[keyof InputValuesParameters] | null => {
  try {
    switch (type) {
      case "number":
        return Number(value)
      case "boolean":
        return value.toLowerCase() === "true"
      case "object":
        return JSON.parse(value)
      case "array":
        const parsed = JSON.parse(value)
        if (!Array.isArray(parsed)) throw new Error("Value must be an array")
        return parsed.filter(
          (item): item is string | number | boolean =>
            typeof item === "string" ||
            typeof item === "number" ||
            typeof item === "boolean"
        )
      default:
        return value
    }
  } catch (error) {
    console.error("Error parsing value:", error)
    return null
  }
}

export function InputValuesForm({ control, index }: { control: Control<HookFormValues>; index: number }) {
  const { setValue } = useFormContext<HookFormValues>()
  const [inputValues, setInputValues] = useState<InputValue[]>([])
  const [newInput, setNewInput] = useState({
    key: "",
    type: "string" as InputValueType,
    value: ""
  })

  const updateParameters = (values: InputValue[]) => {
    const parameters = Object.fromEntries(
      values.map(({ key, value }) => [key, value])
    ) as InputValuesParameters
    setValue(`actions.${index}.parameters`, parameters)
    return parameters
  }

  const handleAddInput = () => {
    if (!newInput.key.trim()) return

    const parsedValue = parseInputValue(newInput.value, newInput.type)
    if (parsedValue === null) return

    const updatedValues = [
      ...inputValues,
      { key: newInput.key, type: newInput.type, value: parsedValue }
    ]
    setInputValues(updatedValues)
    updateParameters(updatedValues)
    setNewInput({ key: "", type: "string", value: "" })
  }

  const handleRemoveInput = (key: string) => {
    const updatedValues = inputValues.filter(input => input.key !== key)
    setInputValues(updatedValues)
    updateParameters(updatedValues)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Key</Label>
          <Input
            value={newInput.key}
            onChange={e => setNewInput({ ...newInput, key: e.target.value })}
            placeholder="Enter key"
          />
        </div>
        <div>
          <Label>Type</Label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={newInput.type}
            onChange={e => setNewInput({ ...newInput, type: e.target.value as InputValueType })}
          >
            {INPUT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Value</Label>
          <Input
            value={newInput.value}
            onChange={e => setNewInput({ ...newInput, value: e.target.value })}
            placeholder={INPUT_TYPES.find(t => t.value === newInput.type)?.placeholder}
          />
        </div>
      </div>

      <Button type="button" variant="outline" onClick={handleAddInput}>
        Add Input
      </Button>

      {inputValues.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Inputs</h4>
          <div className="space-y-2">
            {inputValues.map(input => (
              <div
                key={input.key}
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
                  onClick={() => handleRemoveInput(input.key)}
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
              inputValues.map(({ key, value }) => [key, value])
            ))}
          />
        )}
      />
    </div>
  )
}
