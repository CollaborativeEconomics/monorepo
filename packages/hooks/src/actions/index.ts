import createStory, {
  createStories,
  type CreateStoriesParameters,
  type CreateStoryParameters,
} from "./createStory"
import fetchDataFromApi from "./fetchDataFromApi"
import filter from "./filter"
import find from "./find"
import formatDate from "./formatDate"
import inputValues from "./inputValues"
import math from "./math"
import transform, { transformEach } from "./transform"

// Define the actions record with proper types
const actions = {
  FetchDataFromApi: fetchDataFromApi,
  Math: math,
  Transform: transform,
  TransformEach: transformEach,
  CreateStory: createStory,
  CreateStories: createStories,
  InputValues: inputValues,
  Find: find,
  Filter: filter,
  FormatDate: formatDate,
} as const

export default actions
