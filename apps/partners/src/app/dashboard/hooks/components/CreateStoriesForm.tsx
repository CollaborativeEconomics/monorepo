import { Input, Label } from "@cfce/components/ui"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { HookFormValues } from "../types"

type FormField = {
  id: keyof CreateStoriesParams
  label: string
  description?: string
}

type CreateStoriesParams = {
  organizationId: string
  initiativeId: string
  storyPath: string
}

const FORM_FIELDS: FormField[] = [
  {
    id: "organizationId",
    label: "Organization ID"
  },
  {
    id: "initiativeId",
    label: "Initiative ID"
  },
  {
    id: "storyPath",
    label: "Story Path",
    description: "Path to the stories data in the context object"
  }
]

export function CreateStoriesForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  const renderField = ({ id, label, description }: FormField) => (
    <div key={id}>
      <Label htmlFor={`actions.${index}.parameters.${id}`}>{label}</Label>
      <Controller
        control={control}
        name={`actions.${index}.parameters.${id}`}
        render={({ field }) => (
          <Input
            {...field}
            value={(field.value as string) || ""}
          />
        )}
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
