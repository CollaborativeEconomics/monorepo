// Import action parameter types from the shared types package
import type {
  ActionParams as HookActionParams,
  InputValuesParameters,
  CreateStoryParameters,
  CreateStoriesParameters,
  FetchDataFromApiParameters,
  FindParameters,
  FilterParameters,
  FormatDateParameters,
  MathParameters,
  TransformParameters,
  TransformEachParameters,
} from "@cfce/types"

// Use the imported ActionParams type for Prisma JSON fields
declare global {
  namespace PrismaJson {
    type ActionParams = HookActionParams
  }
}