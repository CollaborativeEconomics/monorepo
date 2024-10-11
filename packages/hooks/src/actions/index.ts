import type { ActionFunction, ActionName } from "../types"
import createStory, {
  createStories,
  type CreateStoriesParameters,
  type CreateStoryParameters,
} from "./createStory"
import fetchDataFromApi, {
  type FetchDataFromApiParameters,
} from "./fetchDataFromApi"
import filter, { type FilterParameters } from "./filter"
import find, { type FindParameters } from "./find"
import formatDate, { type FormatDateParameters } from "./formatDate"
import type { InputValuesParameters } from "./inputValues"
import inputValues from "./inputValues"
import math, { type MathParameters } from "./math"
import transform, {
  type TransformEachParameters,
  type TransformParameters,
  transformEach,
} from "./transform"

type Actions = {
  fetchDataFromApi: ActionFunction<FetchDataFromApiParameters>
  math: ActionFunction<MathParameters>
  transform: ActionFunction<TransformParameters>
  transformEach: ActionFunction<TransformEachParameters>
  createStory: ActionFunction<CreateStoryParameters>
  createStories: ActionFunction<CreateStoriesParameters>
  inputValues: ActionFunction<InputValuesParameters>
  find: ActionFunction<FindParameters>
  filter: ActionFunction<FilterParameters>
  formatDate: ActionFunction<FormatDateParameters>
}

const actions: Record<ActionName, ActionFunction<any>> = {
  fetchDataFromApi,
  math,
  transform: transform,
  transformEach,
  createStory,
  createStories,
  inputValues,
  find,
  filter,
  formatDate,
}

export default actions
