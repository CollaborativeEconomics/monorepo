import { Input, Label, Textarea } from "@cfce/components/ui"
import { type ActionName, type TriggerName } from "@cfce/types"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { HookFormValues } from "../types"

type FormField = {
  id: keyof CreateStoryParams
  label: string
  type: "text" | "textarea" | "number"
  description?: string
}

type CreateStoryParams = {
  organizationId: string
  initiativeId: string
  name: string
  description: string
  image: string
  amount: number
}

const FORM_FIELDS: FormField[] = [
  {
    id: "organizationId",
    label: "Organization ID",
    type: "text"
  },
  {
    id: "initiativeId",
    label: "Initiative ID",
    type: "text"
  },
  {
    id: "name",
    label: "Name",
    type: "text"
  },
  {
    id: "description",
    label: "Description",
    type: "textarea"
  },
  {
    id: "image",
    label: "Image URL",
    type: "text"
  },
  {
    id: "amount",
    label: "Amount",
    type: "number",
    description: "Optional"
  }
]

export function CreateStoryForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  const renderField = ({ id, label, type, description }: FormField) => (
    <div key={id}>
      <Label htmlFor={`actions.${index}.parameters.${id}`}>{label}</Label>
      <Controller
        control={control}
        name={`actions.${index}.parameters.${id}`}
        render={({ field }) => {
          const value = type === "number" 
            ? (field.value as number) || 0
            : (field.value as string) || ""

          if (type === "textarea") {
            return (
              <Textarea
                {...field}
                value={value as string}
              />
            )
          }

          return (
            <Input
              {...field}
              type={type}
              value={value}
              onChange={type === "number" 
                ? (e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))
                : field.onChange
              }
            />
          )
        }}
      />
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {FORM_FIELDS.map(renderField)}
    </div>
  )
}
