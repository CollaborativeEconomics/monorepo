import { Button, Input, Label } from "@cfce/components/ui"
import { type ActionName, type TriggerName } from "@cfce/types"
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

export function TransformForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  const [transformKeys, setTransformKeys] = useState<string[]>([])
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  // Get the current parameters
  const getParameters = () => {
    const parameters: Record<string, string> = {}
    for (const key of transformKeys) {
      const value = control._formValues.actions?.[index]?.parameters?.[key]
      if (value) {
        parameters[key] = value as string
      }
    }
    return parameters
  }

  // Add a new transform key-value pair
  const addTransform = () => {
    if (!newKey.trim()) return

    // Add the new key to the list
    if (!transformKeys.includes(newKey)) {
      setTransformKeys([...transformKeys, newKey])
    }

    // Update the form field
    const actions = control._formValues.actions
    if (actions?.[index]) {
      const parameters = { ...actions[index].parameters } as Record<
        string,
        string
      >
      parameters[newKey] = newValue
      actions[index].parameters = parameters
    }

    // Reset the input fields
    setNewKey("")
    setNewValue("")
  }

  // Remove a transform key-value pair
  const removeTransform = (keyToRemove: string) => {
    setTransformKeys(transformKeys.filter((key) => key !== keyToRemove))

    // Update the form field
    const actions = control._formValues.actions
    if (actions?.[index]) {
      const parameters = { ...actions[index].parameters } as Record<
        string,
        string
      >
      delete parameters[keyToRemove]
      actions[index].parameters = parameters
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Key</Label>
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Enter key"
          />
        </div>
        <div>
          <Label>Value</Label>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>
      </div>

      <Button type="button" variant="outline" onClick={addTransform}>
        Add Transform
      </Button>

      {transformKeys.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Transforms</h4>
          <div className="space-y-2">
            {transformKeys.map((key) => (
              <div
                key={`transform-${key}`}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div>
                  <span className="font-medium">{key}</span>:{" "}
                  <span className="text-gray-600">
                    {(control._formValues.actions?.[index]?.parameters?.[
                      key
                    ] as string) || ""}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTransform(key)}
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
