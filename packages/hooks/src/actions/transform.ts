import { get, reduce, set } from "lodash"
import type { ActionContext } from "../types"

export interface TransformParameters {
  [key: string]: string
}

// Transform
export default async function transform(
  context: ActionContext,
  parameters: TransformParameters,
): Promise<unknown> {
  return reduce(
    parameters,
    (result, newPath, originalPath) => {
      if (typeof newPath !== "string" || typeof originalPath !== "string") {
        throw new Error(
          `Invalid transform input of type ${typeof newPath}/${typeof originalPath}`,
        )
      }
      const value = get(context, originalPath)
      set(result, newPath, value)
      return result
    },
    {},
  )
}

export interface TransformEachParameters {
  collectionPath: string
  transformParameter: TransformParameters
}
export function transformEach(
  context: ActionContext,
  { collectionPath, transformParameter }: TransformEachParameters,
): Promise<unknown> {
  const collection = get(context, collectionPath)
  if (!Array.isArray(collection)) {
    throw new Error("Expected an array at the specified collection path")
  }
  return Promise.all(
    collection.map((item) => {
      return transform(item, transformParameter)
    }),
  )
}
