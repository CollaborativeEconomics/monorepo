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
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { HookFormValues } from "../types"

type FetchDataFromApiParams = {
  endpoint: string
  method: string
  body: Record<string, unknown>
  headers: Record<string, string>
}

type FormField = {
  id: keyof FetchDataFromApiParams
  label: string
  type: "text" | "select" | "json"
  description?: string
  options?: string[]
}

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"]

const FORM_FIELDS: FormField[] = [
  {
    id: "endpoint",
    label: "Endpoint URL",
    type: "text",
    description: "Supports context variables using {context.path.to.value} syntax"
  },
  {
    id: "method",
    label: "HTTP Method",
    type: "select",
    options: HTTP_METHODS
  },
  {
    id: "body",
    label: "Request Body",
    type: "json",
    description: "JSON object to send with the request"
  },
  {
    id: "headers",
    label: "Request Headers",
    type: "json",
    description: "Additional headers to include in the request"
  }
]

const parseJsonField = (value: string): Record<string, unknown> => {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const stringifyJsonField = (value: Record<string, unknown>): string => {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return "{}"
  }
}

export function FetchDataFromApiForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              case "json":
                return (
                  <Input
                    {...fieldProps}
                    value={stringifyJsonField(value as Record<string, unknown>)}
                    onChange={e => {
                      try {
                        const parsed = parseJsonField(e.target.value)
                        onChange(parsed)
                      } catch {
                        onChange({})
                      }
                    }}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )
              default:
                return (
                  <Input
                    {...fieldProps}
                    value={value as string}
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
