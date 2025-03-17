export interface InputValuesParameters {
  [key: string]:
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | InputValuesParameters
}

export interface CreateStoryParameters {
  organizationId: string
  initiativeId: string
  name: string
  description: string
  image: string
  // how many tokens to mint in set, default = 0
  amount?: number
  // path to object, or stringified object
  metadata?: string
  files?: {
    files: File[]
  }
}

export interface CreateStoriesParameters {
  organizationId: string
  initiativeId: string
  storyPath: string
}

export interface FetchDataFromApiParameters {
  endpoint: string
  method: string
  body: Record<string, unknown>
  headers: Record<string, string>
}

export type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=" | "&&" | "||"

// Define the type for the operators
export type Operators = Record<
  Operator,
  (a: string | number, b: string | number) => boolean
>

export interface FindParameters {
  operator: Operator
  collectionPath: string // where is the collection stored in the context
  key?: string // the key to compare against
  value: string | number | boolean // the value to compare against
}

export interface FilterParameters {
  operator: Operator
  collectionPath: string // where is the collection stored in the context
  key?: string // the key to compare against
  value: string | number | boolean // the value to compare against
}

export interface FormatDateParameters {
  inputDate: string | number | Date
  format: string
}

export interface MathParameters {
  inputA: string | number
  inputB: string | number
  operation: "multiply" | "divide" | "add" | "subtract"
}

export interface TransformParameters {
  [key: string]: string
}

export interface TransformEachParameters {
  collectionPath: string
  transformParameter: TransformParameters
}

// Action types and trigger types
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

// Type mapping between action names and their parameter types
export type ActionToParamsMap = {
  FetchDataFromApi: FetchDataFromApiParameters
  Transform: TransformParameters
  TransformEach: TransformEachParameters
  Math: MathParameters
  CreateStory: CreateStoryParameters
  CreateStories: CreateStoriesParameters
  Find: FindParameters
  Filter: FilterParameters
  InputValues: InputValuesParameters
  FormatDate: FormatDateParameters
}

export interface Action<T extends ActionName = ActionName> {
  index: number
  key: string
  action: T
  parameters: ActionToParamsMap[T]
  description: string
  // These are optional because the initial context doesn't have them
  // output?: any
  // allowedNextActions?: ActionName[]
}

// Action context stores data as it passes through the hook
export type ActionContext = Record<string, unknown> // TODO: enumerate output types

export type ActionFunction<T extends keyof ActionToParamsMap> = (
  context: ActionContext,
  params: ActionToParamsMap[T],
  // finalAction?: (arg: ContextParams) => void
) => Promise<unknown>

// Hook definition
export interface Hook {
  trigger: TriggerName
  actions: Action[]
}

export type Actions = {
  [K in ActionName]: ActionFunction<K>
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
