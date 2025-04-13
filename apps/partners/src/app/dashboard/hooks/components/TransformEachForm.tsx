import { Button, Input, Label } from "@cfce/components/ui"
import type { Control } from "react-hook-form"
import { Controller, useFormContext } from "react-hook-form"
import type { HookFormValues } from "../types"
import { useEffect, useState } from "react"

type TransformEachParams = {
  collectionPath: string
  transformParameter: Record<string, string>
}

interface TransformParam {
  key: string
  value: string
}

const DEFAULT_PARAMS: TransformEachParams = {
  collectionPath: "",
  transformParameter: {}
}

export function TransformEachForm({ control, index }: { control: Control<HookFormValues>; index: number }) {
  const { setValue, getValues } = useFormContext<HookFormValues>()
  const [params, setParams] = useState<TransformParam[]>([])
  const [newParam, setNewParam] = useState<TransformParam>({ key: "", value: "" })
  const [collectionPath, setCollectionPath] = useState("")

  // Initialize from existing parameters
  useEffect(() => {
    const existingParams = getValues(`actions.${index}.parameters`) as TransformEachParams || DEFAULT_PARAMS
    setCollectionPath(existingParams.collectionPath || "")
    setParams(
      Object.entries(existingParams.transformParameter || {}).map(([key, value]) => ({
        key,
        value: String(value)
      }))
    )
  }, [getValues, index])

  const updateFormValues = (
    newCollectionPath: string,
    newParams: TransformParam[]
  ) => {
    const parameters: TransformEachParams = {
      collectionPath: newCollectionPath,
      transformParameter: Object.fromEntries(
        newParams.map(({ key, value }) => [key, value])
      )
    }
    setValue(`actions.${index}.parameters`, parameters)
  }

  const handleCollectionPathChange = (path: string) => {
    setCollectionPath(path)
    updateFormValues(path, params)
  }

  const handleAddParam = () => {
    if (!newParam.key.trim()) return

    const updatedParams = [
      ...params.filter(p => p.key !== newParam.key),
      { ...newParam }
    ]
    setParams(updatedParams)
    updateFormValues(collectionPath, updatedParams)
    setNewParam({ key: "", value: "" })
  }

  const handleRemoveParam = (keyToRemove: string) => {
    const updatedParams = params.filter(p => p.key !== keyToRemove)
    setParams(updatedParams)
    updateFormValues(collectionPath, updatedParams)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Collection Path</Label>
        <Input
          value={collectionPath}
          onChange={e => handleCollectionPathChange(e.target.value)}
          placeholder="Path to the collection in the context"
        />
        <p className="text-xs text-gray-500">
          Path to the collection in the context object that will be transformed
        </p>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Transform Parameters</h4>
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
          className="mt-2"
        >
          Add Transform Parameter
        </Button>
      </div>

      {params.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Transform Parameters</h4>
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
            value={JSON.stringify({
              collectionPath,
              transformParameter: Object.fromEntries(
                params.map(({ key, value }) => [key, value])
              )
            })}
          />
        )}
      />
    </div>
  )
}
