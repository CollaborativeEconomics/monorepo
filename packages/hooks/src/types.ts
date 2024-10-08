import type {
  CreateStoriesParameters,
  CreateStoryParameters,
} from "./actions/createStory"
import type { FetchDataFromApiParameters } from "./actions/fetchDataFromApi"
import type { FilterParameters } from "./actions/filter"
import type { FindParameters } from "./actions/find"
import type { FormatDateParameters } from "./actions/formatDate"
import type { InputValuesParameters } from "./actions/inputValues"
import type { MathParameters } from "./actions/math"
import type {
  TransformEachParameters,
  TransformParameters,
} from "./actions/transform"

// Action types and trigger types
export const ActionTypes = {
  fetchDataFromApi: "fetchDataFromApi",
  transform: "transform",
  transformEach: "transformEach",
  math: "math",
  createStory: "createStory",
  createStories: "createStories",
  find: "find",
  filter: "filter",
  inputValues: "inputValues",
  formatDate: "formatDate",
} as const

export const Triggers = {
  addMetadataToNFTReceipt: "addMetadataToNFTReceipt",
  onceDaily: "onceDaily",
} as const

export type ActionName = (typeof ActionTypes)[keyof typeof ActionTypes]
export type TriggerName = (typeof Triggers)[keyof typeof Triggers]

// Parameter and action definitions
export type ContextParams =
  | FetchDataFromApiParameters
  | MathParameters
  | TransformParameters
  | TransformEachParameters
  | CreateStoryParameters
  | CreateStoriesParameters
  | InputValuesParameters
  | FindParameters
  | FilterParameters
  | FormatDateParameters

export interface Actions {
  // key: string // unique identifier for the action
  actionDefinition: ActionDefinition
  // These are optional because the initial context doesn't have them
  // output?: any
  // description?: string
  // allowedNextActions?: ActionName[]
}

export interface ActionDefinition {
  parameters: ContextParams
  key: string
  action: ActionName
  description: string
}

// Action context stores data as it passes through the hook
export type ActionContext = Record<string, any> // TODO: enumerate output types

export type ActionFunction<T extends ContextParams> = (
  context: ActionContext,
  params: T,
  // finalAction?: (arg: ContextParams) => void
) => Promise<unknown>

export type allowedMathOperations = "multiply" | "divide" | "add" | "subtract"

// Hook definition
export interface Hook {
  trigger: TriggerName
  actions: ActionDefinition[]
}

// SDK configuration interface
export interface SDKConfig {
  registryApiKey: string
}
