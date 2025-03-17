import type { ActionContext } from "@cfce/types"
import { get } from "lodash"
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
  const collectionValue = get(context, collectionPath)
  const collection = Array.isArray(collectionValue) ? collectionValue : []

  if (!Array.isArray(collection)) {
    throw new Error("Expected an array at the specified collection path")
  }

  // If the value is a path, get the value, otherwise use the value as is
  const valueToCompareRaw =
    typeof value === "string" ? get(context, value, value) : value

  // Ensure valueToCompare is a string or number
  const valueToCompare = valueToCompareRaw as string | number

  // Find the predicate function based on the operator
  const predicateFunction: PredicateFunction = operators[operator]
  return collection.filter((item) => {
    const itemValue = key ? get(item, key) : item
    // Type assertion for itemValue
    return predicateFunction(itemValue as string | number, valueToCompare)
  })
}
