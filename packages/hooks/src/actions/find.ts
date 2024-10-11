import { get } from "lodash"
import type { ActionContext } from "../types"

export type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=" | "&&" | "||"

// Define the type for the operators
export type Operators = Record<
  Operator,
  (a: string | number, b: string | number) => boolean
>

// Define the type for the predicate function
export type PredicateFunction = (
  a: string | number,
  b: string | number,
) => boolean

export const operators: Operators = {
  "===": (a, b) => a === b,
  "!==": (a, b) => a !== b,
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  "&&": (a, b) => Boolean(a) && Boolean(b),
  "||": (a, b) => Boolean(a) || Boolean(b),
}

export interface FindParameters {
  operator: Operator
  collectionPath: string // where is the collection stored in the context
  key?: string // the key to compare against
  value: string | number | boolean // the value to compare against
}

export default async function find(
  context: ActionContext,
  { collectionPath, operator, value, key }: FindParameters,
): Promise<unknown> {
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
  return collection.find((item) => {
    const itemValue = key ? get(item, key) : item
    return predicateFunction(itemValue, valueToCompare)
  })
}
