import { get } from "lodash"
import type { ActionContext } from "../types"
import { type Operator, type PredicateFunction, operators } from "./find"

export interface FilterParameters {
  operator: Operator
  collectionPath: string // where is the collection stored in the context
  key?: string // the key to compare against
  value: string | number | boolean // the value to compare against
}

export default async function filter(
  context: ActionContext,
  { collectionPath, operator, value, key }: FilterParameters,
): Promise<unknown[]> {
  // Get the collection from the context
  const collection: unknown[] = get(context, collectionPath)
  if (!Array.isArray(collection)) {
    throw new Error("Expected an array at the specified collection path")
  }

  // If the value is a path, get the value, otherwise use the value as is
  const valueToCompare =
    typeof value === "string" ? get(context, value, value) : value

  // Find the predicate function based on the operator
  const predicateFunction: PredicateFunction = operators[operator]
  return collection.filter((item) => {
    const itemValue = key ? get(item, key) : item
    return predicateFunction(itemValue, valueToCompare)
  })
}
