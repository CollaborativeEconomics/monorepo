import { ActionFunction, ActionName } from "../types";
import createStory, { createStories, CreateStoriesParameters, CreateStoryParameters } from "./createStory";
import fetchDataFromApi, { FetchDataFromApiParameters } from "./fetchDataFromApi";
import { InputValuesParameters } from "./inputValues";
import math, { MathParameters } from "./math";
import transform, { TransformEachParameters, TransformParameters, transformEach } from "./transform";
import inputValues from "./inputValues";
import find, { FindParameters } from "./find";
import filter, { FilterParameters } from "./filter";
import formatDate, { FormatDateParameters } from "./formatDate";

type Actions = {
  fetchDataFromApi: ActionFunction<FetchDataFromApiParameters>,
  math: ActionFunction<MathParameters>,
  transform: ActionFunction<TransformParameters>,
  transformEach: ActionFunction<TransformEachParameters>,
  createStory: ActionFunction<CreateStoryParameters>,
  createStories: ActionFunction<CreateStoriesParameters>,
  inputValues: ActionFunction<InputValuesParameters>,
  find: ActionFunction<FindParameters>,
  filter: ActionFunction<FilterParameters>,
  formatDate: ActionFunction<FormatDateParameters>,
};

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

export default actions;