// Define detailed ActionParams type with all specific parameter interfaces

interface InputValuesParameters {
  [key: string]:
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | InputValuesParameters
}

interface CreateStoryParameters {
  organizationId: string
  initiativeId: string
  name: string
  description: string
  image: string
  amount?: number
  metadata?: string
  files?: {
    files: File[]
  }
}

interface CreateStoriesParameters {
  organizationId: string
  initiativeId: string
  storyPath: string
}

interface FetchDataFromApiParameters {
  endpoint: string
  method: string
  body: Record<string, unknown>
  headers: Record<string, string>
}

type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=" | "&&" | "||"

interface FindParameters {
  operator: Operator
  collectionPath: string
  key?: string
  value: string | number | boolean
}

interface FilterParameters {
  operator: Operator
  collectionPath: string
  key?: string
  value: string | number | boolean
}

interface FormatDateParameters {
  inputDate: string | number | Date
  format: string
}

interface MathParameters {
  inputA: string | number
  inputB: string | number
  operation: "multiply" | "divide" | "add" | "subtract"
}

interface TransformParameters {
  [key: string]: string
}

interface TransformEachParameters {
  collectionPath: string
  transformParameter: TransformParameters
}

// Union type of all action parameter types
type ActionParamsType =
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

declare global {
  namespace PrismaJson {
    type ActionParams = ActionParamsType
  }
}