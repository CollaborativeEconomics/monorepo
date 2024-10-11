import { get } from "lodash"
import type { ActionContext } from "../types"

export interface MathParameters {
  inputA: string | number
  inputB: string | number
  operation: "multiply" | "divide" | "add" | "subtract"
}

export default async function (
  context: ActionContext,
  parameters: MathParameters,
): Promise<number> {
  let inputA = parameters.inputA
  let inputB = parameters.inputB
  // if its a path, extract the value
  if (typeof inputA === "string") {
    inputA = Number(get(context, inputA, inputA))
  }
  if (typeof inputB === "string") {
    inputB = Number(get(context, inputB, inputB))
  }
  const operation = parameters.operation
  if (typeof inputA !== "number" || typeof inputB !== "number") {
    throw new Error(`Invalid input type for math action: ${typeof inputA}`)
  }
  switch (operation) {
    case "multiply":
      return inputA * inputB
    case "divide":
      return inputA / inputB
    case "add":
      return inputA + inputB
    case "subtract":
      return inputA - inputB
    default:
      return inputA
  }
}
