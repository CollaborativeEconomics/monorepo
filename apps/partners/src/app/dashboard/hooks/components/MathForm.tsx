import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cfce/components/ui"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { HookFormValues } from "../types"

type MathParams = {
  inputA: string
  inputB: string
  operation: "add" | "subtract" | "multiply" | "divide"
}

type FormField = {
  id: keyof MathParams
  label: string
  type: "text" | "select"
  description?: string
  options?: string[]
}

const OPERATIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" }
] as const

const FORM_FIELDS: FormField[] = [
  {
    id: "inputA",
    label: "Input A",
    type: "text",
    description: "Can be a number or a path to a value in the context"
  },
  {
    id: "inputB",
    label: "Input B",
    type: "text",
    description: "Can be a number or a path to a value in the context"
  },
  {
    id: "operation",
    label: "Operation",
    type: "select",
    options: OPERATIONS.map(op => op.value)
  }
]

export function MathForm({ control, index }: { control: Control<HookFormValues>; index: number }) {
  const renderField = (field: FormField) => {
    const basePath = `actions.${index}.parameters` as const

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={`${basePath}.${field.id}`}>{field.label}</Label>
        <Controller
          control={control}
          name={`${basePath}.${field.id}` as const}
          render={({ field: { value, onChange, ...fieldProps } }) => {
            switch (field.type) {
              case "select":
                return (
                  <Select
                    value={value as string}
                    onValueChange={onChange}
                    defaultValue="add"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATIONS.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              default:
                return (
                  <Input
                    {...fieldProps}
                    value={value as string || ""}
                    onChange={e => onChange(e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )
            }
          }}
        />
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {FORM_FIELDS.map(renderField)}
    </div>
  )
}
