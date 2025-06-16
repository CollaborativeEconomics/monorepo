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

type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=" | "&&" | "||"

type FilterParams = {
  collectionPath: string
  key: string
  value: string
  operator: Operator
}

type FormField = {
  id: keyof FilterParams
  label: string
  type: "text" | "select"
  description?: string
  options?: Array<{ value: Operator | string; label: string }>
}

const OPERATORS = [
  { value: "===" as const, label: "Equals (===)" },
  { value: "!==" as const, label: "Not Equals (!==)" },
  { value: ">" as const, label: "Greater Than (>)" },
  { value: "<" as const, label: "Less Than (<)" },
  { value: ">=" as const, label: "Greater Than or Equal (>=)" },
  { value: "<=" as const, label: "Less Than or Equal (<=)" },
  { value: "&&" as const, label: "AND (&&)" },
  { value: "||" as const, label: "OR (||)" }
]

const FORM_FIELDS: FormField[] = [
  {
    id: "collectionPath",
    label: "Collection Path",
    type: "text",
    description: "Path to the collection in the context object"
  },
  {
    id: "key",
    label: "Key",
    type: "text",
    description: "The property key to compare against"
  },
  {
    id: "value",
    label: "Value",
    type: "text",
    description: "The value to compare against"
  },
  {
    id: "operator",
    label: "Operator",
    type: "select",
    options: OPERATORS
  }
]

export function FilterForm({ control, index }: { control: Control<HookFormValues>; index: number }) {
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
                    defaultValue="==="
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(op => (
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
                    value={String(value || "")}
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
