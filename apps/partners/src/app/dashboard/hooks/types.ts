import type { ActionName, ActionParams, TriggerName, ActionToParamsMap } from "@cfce/types"
import { ActionTypes, Triggers } from "@cfce/types"
import { z } from "zod"

// Define the schema for the form
export const actionSchema = z.object({
  index: z.number(),
  key: z.string().min(1, "Key is required"),
  action: z.enum(Object.values(ActionTypes) as [ActionName, ...ActionName[]]),
  description: z.string().optional(),
  parameters: z.unknown().refine(
    (val): val is ActionParams => true,
    "Parameters must match the action type"
  ),
})

export const hookSchema = z.object({
  id: z.string().optional(),
  trigger: z.enum(Object.values(Triggers) as [TriggerName, ...TriggerName[]]),
  description: z.string().optional(),
  actions: z.array(actionSchema),
})

export type HookFormValues = z.infer<typeof hookSchema>

