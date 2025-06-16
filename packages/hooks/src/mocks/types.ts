// Mock for @cfce/types

export type ActionName =
  | "FetchDataFromApi"
  | "Transform"
  | "TransformEach"
  | "Math"
  | "CreateStory"
  | "CreateStories"
  | "Find"
  | "Filter"
  | "InputValues"
  | "FormatDate"

export type TriggerName = "AddMetadataToNFTReceipt" | "OnceDaily"

export const Triggers: Record<TriggerName, TriggerName> = {
  AddMetadataToNFTReceipt: "AddMetadataToNFTReceipt",
  OnceDaily: "OnceDaily",
}

export const ActionTypes: Record<ActionName, ActionName> = {
  FetchDataFromApi: "FetchDataFromApi",
  Transform: "Transform",
  TransformEach: "TransformEach",
  Math: "Math",
  CreateStory: "CreateStory",
  CreateStories: "CreateStories",
  Find: "Find",
  Filter: "Filter",
  InputValues: "InputValues",
  FormatDate: "FormatDate",
}

// Mock other types as needed
export interface Action<T extends ActionName = ActionName> {
  index: number
  key: string
  action: T
  parameters: Record<string, unknown>
  description: string
}

export interface Hook {
  trigger: TriggerName
  actions: Action[]
}

export type ActionContext = Record<string, unknown>
