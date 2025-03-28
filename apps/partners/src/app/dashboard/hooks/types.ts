import type { ActionName, TriggerName } from "@cfce/types"
import { ActionTypes, Triggers } from "@cfce/types"
import { z } from "zod"

// Define the schema for the form
export const actionSchema = z.object({
  index: z.number(),
  key: z.string().min(1, "Key is required"),
  action: z.enum(Object.values(ActionTypes) as [ActionName, ...ActionName[]]),
  description: z.string().optional(),
  parameters: z.record(z.unknown()),
})

export const hookSchema = z.object({
  id: z.string().optional(),
  trigger: z.enum(Object.values(Triggers) as [TriggerName, ...TriggerName[]]),
  description: z.string().optional(),
  actions: z.array(actionSchema),
})

export type HookFormValues = z.infer<typeof hookSchema>

// Define a type for the hook objects returned from the server
export interface Hook {
  id: string
  triggerName: TriggerName
  description: string | null
  actions: Array<{
    id: string
    index: number
    key: string
    action: ActionName
    description: string | null
    parameters: Record<string, unknown> | null
  }>
}
