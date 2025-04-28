"use client"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@cfce/components/ui"
import {
  type ActionName,
  ActionParams,
  ActionTypes,
  type TriggerName,
  Triggers,
} from "@cfce/types"
import { useState } from "react"
import {
  type Control,
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { createHook, createHookAction, deleteHook } from "./actions"
import { CreateStoriesForm } from "./components/CreateStoriesForm"
import { CreateStoryForm } from "./components/CreateStoryForm"
import { FetchDataFromApiForm } from "./components/FetchDataFromApiForm"
import { FilterForm } from "./components/FilterForm"
import { FormatDateForm } from "./components/FormatDateForm"
import { InputValuesForm } from "./components/InputValuesForm"
import { MathForm } from "./components/MathForm"
import { TransformEachForm } from "./components/TransformEachForm"
import { TransformForm } from "./components/TransformForm"
import { type HookFormValues } from "./types"
import { Prisma, type Hook } from "@cfce/database"

// Default empty parameters for each action type
const getDefaultParameters = (actionType: ActionName): ActionParams => {
  switch (actionType) {
    case "FetchDataFromApi":
      return { endpoint: "", method: "GET", body: {}, headers: {} }
    case "CreateStory":
      return {
        organizationId: "",
        initiativeId: "",
        name: "",
        description: "",
        image: "",
        amount: 0,
      }
    case "CreateStories":
      return { organizationId: "", initiativeId: "", storyPath: "" }
    case "Transform":
      return {}
    case "TransformEach":
      return { collectionPath: "", transformParameter: {} }
    case "Math":
      return { inputA: "", inputB: "", operation: "add" }
    case "Find":
    case "Filter":
      return { operator: "===", collectionPath: "", key: "", value: "" }
    case "InputValues":
      return {}
    case "FormatDate":
      return { inputDate: "", format: "" }
    default:
      return {}
  }
}

// Main client component
export function HooksManagementClient({
  organizationId,
  initialHooks,
}: {
  organizationId: string
  initialHooks: Prisma.HookGetPayload<{include: {actions: true}}>[]
}) {
  const [activeTab, setActiveTab] = useState<string>(Object.values(Triggers)[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find the hook for the current organization
  const currentHook = initialHooks.length > 0 ? initialHooks[0] : null

  // Setup form with react-hook-form
  const methods = useForm<HookFormValues>({
    defaultValues: {
      id: currentHook?.id || undefined,
      trigger: activeTab as TriggerName,
      description: currentHook?.description || "",
      // @ts-expect-error prisma type is not as detailed as the hook type
      actions: currentHook?.actions || [],
    },
  })

  const { control, handleSubmit, reset, watch, setValue } = methods
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "actions",
  })

  // Watch for changes in the active tab
  const watchedTrigger = watch("trigger")
  if (watchedTrigger !== activeTab) {
    setValue("trigger", activeTab as TriggerName)
  }

  // Handle form submission
  const onSubmit = async (data: HookFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // If editing an existing hook
      if (data.id) {
        // First delete the existing hook
        const deleteResult = await deleteHook(data.id)
        if (!deleteResult.success) {
          throw new Error(
            deleteResult.error || "Failed to delete existing hook",
          )
        }
      }

      // Create a new hook
      const createResult = await createHook({
        triggerName: data.trigger,
        orgId: organizationId,
        description: data.description || "",
      })

      if (!createResult.success) {
        throw new Error(createResult.error || "Failed to create hook")
      }

      const newHookData = createResult.data
      if (!newHookData) {
        throw new Error("No hook data returned from server")
      }

      // Create actions for the hook
      for (const action of data.actions) {
        const actionResult = await createHookAction(newHookData.id, {
          ...action,
          parameters: action.parameters,
        })

        if (!actionResult.success) {
          throw new Error(actionResult.error || "Failed to create action")
        }
      }

      // Show success message
      alert("Hook saved successfully")

      // Refresh the page to get the updated hooks
      window.location.reload()
    } catch (error) {
      console.error("Error saving hook:", error)
      setError(
        `Failed to save hook: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a new action to the form
  const handleAddAction = () => {
    const newIndex = fields.length
    append({
      index: newIndex,
      key: `action_${newIndex}`,
      action: "Transform" as ActionName,
      description: "",
      parameters: getDefaultParameters("Transform"),
    })
  }

  // Handle action type change
  const handleActionTypeChange = (index: number, newType: ActionName) => {
    setValue(`actions.${index}.action`, newType)
    setValue(`actions.${index}.parameters`, getDefaultParameters(newType))
  }

  // Move an action up or down in the list
  const moveAction = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < fields.length) {
      move(index, newIndex)

      // Update indices
      setValue(`actions.${newIndex}.index`, newIndex)
      setValue(`actions.${index}.index`, index)
    }
  }

  const renderActionParameterForm = (
    action: string,
    control: Control<HookFormValues>,
    index: number,
  ) => {
    const actionLower = action.toLowerCase()
    switch (actionLower) {
      case "inputvalues":
        return <InputValuesForm control={control} index={index} />
      case "fetchdatafromapi":
        return <FetchDataFromApiForm control={control} index={index} />
      case "math":
        return <MathForm control={control} index={index} />
      case "filter":
      case "find":
        return <FilterForm control={control} index={index} />
      case "formatdate":
        return <FormatDateForm control={control} index={index} />
      case "transformeach":
        return <TransformEachForm control={control} index={index} />
      case "transform":
        return <TransformForm control={control} index={index} />
      case "createstory":
        return <CreateStoryForm control={control} index={index} />
      case "createstories":
        return <CreateStoriesForm control={control} index={index} />
      default:
        return (
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
            <p className="text-yellow-800">
              No parameter form available for action type: {action}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {Object.values(Triggers).map((trigger) => (
            <TabsTrigger key={trigger} value={trigger}>
              {trigger}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab} Hook
              {currentHook && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this hook?")) {
                      try {
                        setIsSubmitting(true)
                        setError(null)

                        const result = await deleteHook(currentHook.id)

                        if (result.success) {
                          alert("Hook deleted successfully")
                          window.location.reload()
                        } else {
                          throw new Error(
                            result.error || "Failed to delete hook",
                          )
                        }
                      } catch (error) {
                        console.error("Error deleting hook:", error)
                        setError(
                          `Failed to delete hook: ${error instanceof Error ? error.message : String(error)}`,
                        )
                      } finally {
                        setIsSubmitting(false)
                      }
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Delete Hook
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Configure actions that will be executed when this trigger occurs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="description">Hook Description</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => <Input {...field} />}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Actions</h3>
                    <Button
                      type="button"
                      onClick={handleAddAction}
                      variant="outline"
                    >
                      Add Action
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border rounded-md overflow-hidden"
                      >
                        <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
                          <span>
                            {index + 1}. {watch(`actions.${index}.action`)} -{" "}
                            {watch(`actions.${index}.key`)}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => moveAction(index, "up")}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => moveAction(index, "down")}
                              disabled={index === fields.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t">
                          <div className="space-y-4">
                            <input
                              type="hidden"
                              {...methods.register(`actions.${index}.index`)}
                              value={index}
                            />

                            <div>
                              <Label htmlFor={`actions.${index}.key`}>
                                Action Key
                              </Label>
                              <Controller
                                control={control}
                                name={`actions.${index}.key`}
                                render={({ field }) => <Input {...field} />}
                              />
                            </div>

                            <div>
                              <Label htmlFor={`actions.${index}.action`}>
                                Action Type
                              </Label>
                              <Controller
                                control={control}
                                name={`actions.${index}.action`}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={(value: string) =>
                                      handleActionTypeChange(
                                        index,
                                        value as ActionName,
                                      )
                                    }
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select action type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(ActionTypes).map(
                                        (actionType) => (
                                          <SelectItem
                                            key={actionType}
                                            value={actionType}
                                          >
                                            {actionType}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div>
                              <Label htmlFor={`actions.${index}.description`}>
                                Description
                              </Label>
                              <Controller
                                control={control}
                                name={`actions.${index}.description`}
                                render={({ field }) => <Input {...field} />}
                              />
                            </div>

                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Parameters</h4>
                              {renderActionParameterForm(
                                watch(`actions.${index}.action`),
                                control,
                                index,
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Hook"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
