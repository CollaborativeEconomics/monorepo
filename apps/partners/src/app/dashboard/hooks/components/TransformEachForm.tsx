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

export function TransformEachForm({
  control,
  index,
}: {
  control: Control<HookFormValues>
  index: number
}) {
  const [transformKeys, setTransformKeys] = useState<string[]>([])
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [collectionPath, setCollectionPath] = useState("")

  // Initialize from existing parameters
  useState(() => {
    const actions = control._formValues.actions
    if (actions?.[index]?.parameters) {
      const params = actions[index].parameters as Record<string, unknown>
      if (params.collectionPath) {
        setCollectionPath(params.collectionPath as string)
      }
      if (
        params.transformParameter &&
        typeof params.transformParameter === "object"
      ) {
        const transformParams = params.transformParameter as Record<
          string,
          string
        >
        setTransformKeys(Object.keys(transformParams))
      }
    }
  })

  // Get the current parameters
  const getParameters = () => {
    const transformParameter: Record<string, string> = {}
    for (const key of transformKeys) {
      const actions = control._formValues.actions
      if (actions?.[index]?.parameters) {
        const params = actions[index].parameters as Record<string, unknown>
        if (
          params.transformParameter &&
          typeof params.transformParameter === "object"
        ) {
          const transformParams = params.transformParameter as Record<
            string,
            string
          >
          if (transformParams[key]) {
            transformParameter[key] = transformParams[key]
          }
        }
      }
    }

    return {
      collectionPath,
      transformParameter,
    }
  }

  // Update collection path
  const updateCollectionPath = (path: string) => {
    setCollectionPath(path)

    // Update the form field
    const actions = control._formValues.actions
    if (actions?.[index]) {
      const parameters = {
        ...actions[index].parameters,
        collectionPath: path,
      } as Record<string, unknown>
      actions[index].parameters = parameters
    }
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
        unknown
      >
      const transformParameter =
        (parameters.transformParameter as Record<string, string>) || {}
      transformParameter[newKey] = newValue
      parameters.transformParameter = transformParameter
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
        unknown
      >
      const transformParameter =
        (parameters.transformParameter as Record<string, string>) || {}
      delete transformParameter[keyToRemove]
      parameters.transformParameter = transformParameter
      actions[index].parameters = parameters
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`actions.${index}.parameters.collectionPath`}>
          Collection Path
        </Label>
        <Input
          id={`actions.${index}.parameters.collectionPath`}
          value={collectionPath}
          onChange={(e) => updateCollectionPath(e.target.value)}
          placeholder="Path to the collection in the context"
        />
        <p className="text-xs text-gray-500 mt-1">
          Path to the collection in the context object that will be transformed
        </p>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Transform Parameters</h4>
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

        <Button
          type="button"
          variant="outline"
          onClick={addTransform}
          className="mt-2"
        >
          Add Transform Parameter
        </Button>
      </div>

      {transformKeys.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Transform Parameters</h4>
          <div className="space-y-2">
            {transformKeys.map((key) => {
              const actions = control._formValues.actions
              const params =
                (actions?.[index]?.parameters as Record<string, unknown>) || {}
              const transformParams =
                (params.transformParameter as Record<string, string>) || {}

              return (
                <div
                  key={`transform-${key}`}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div>
                    <span className="font-medium">{key}</span>:{" "}
                    <span className="text-gray-600">
                      {transformParams[key] || ""}
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
              )
            })}
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
