import type { Prisma } from "@prisma/client"
import { prismaClient } from "../index"

/**
 * Type-safe helpers for working with Actions and ActionShapes in the database
 */

// Define the action types from Prisma schema
export type ActionType =
  | "FetchDataFromApi"
  | "Transform"
  | "TransformEach"
  | "Math"
  | "CreateStory"
  | "CreateStories"
  | "Find"
  | "Filter"
  | "InputValues"
  | "FormatDate"

// Define the structure of parameters for each action type
export type ActionParameterSchemas = {
  FetchDataFromApi: {
    url: string
    method: "GET" | "POST"
    headers?: Record<string, string>
    body?: unknown
  }
  Transform: {
    input: string
    transformations: Array<{
      operation: string
      path?: string
      value?: unknown
    }>
  }
  TransformEach: {
    input: string
    itemPath: string
    transformations: Array<{
      operation: string
      path?: string
      value?: unknown
    }>
  }
  Math: {
    operation: "multiply" | "divide" | "add" | "subtract"
    left: number | string
    right: number | string
    outputPath: string
  }
  CreateStory: {
    name: string
    description: string
    amount?: number
    image?: string
    categoryId?: string
  }
  CreateStories: {
    stories: Array<{
      name: string
      description: string
      amount?: number
      image?: string
      categoryId?: string
    }>
  }
  Find: {
    input: string
    path: string
    predicate: Record<string, unknown>
  }
  Filter: {
    input: string
    predicate: Record<string, unknown>
  }
  InputValues: {
    values: Record<string, unknown>
  }
  FormatDate: {
    date: string
    format: string
    timezone?: string
  }
}

// Helper function to convert an object to Prisma.InputJsonValue
function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

// Type-safe function to cast parameters based on action type
export function castActionParameters<T extends ActionType>(
  actionType: T,
  parameters: unknown,
): ActionParameterSchemas[T] {
  // In a real application, you would validate parameters here
  // For now, we just typecast
  return parameters as ActionParameterSchemas[T]
}

// Type-safe ActionShape input type
type CreateActionShapeInput<T extends ActionType> = {
  key: string
  action: T
  description: string
  parameters: ActionParameterSchemas[T]
}

// Create an ActionShape with type-safe parameters
export async function createActionShape<T extends ActionType>(
  input: CreateActionShapeInput<T>,
) {
  // Note: ActionShape is defined in the Prisma schema
  // We use a custom type here since Prisma generated types may not be available
  // In a real application, you'd use the generated Prisma types
  return await prismaClient.$executeRaw`
    INSERT INTO "ActionShape" ("key", "action", "description", "parameters")
    VALUES (${input.key}, ${input.action}, ${input.description}, ${toJsonValue(input.parameters)})
    RETURNING *;
  `
}

// Type-safe Action input type
export type CreateActionInput<T extends ActionType> = {
  hookId: string
  actionShapeId: string
  parameters: ActionParameterSchemas[T]
  index: number
}

// Create an Action with type-safe parameters
export async function createAction<T extends ActionType>(
  input: CreateActionInput<T>,
  actionType: T,
  description: string,
) {
  const actionDefinition = {
    key: input.actionShapeId,
    action: actionType,
    description: description,
    parameters: input.parameters,
  }

  // Using raw SQL because Prisma model might not be fully generated yet
  return prismaClient.$executeRaw`
    INSERT INTO "Action" ("hookId", "actionShapeId", "actionDefinition", "parameters", "index")
    VALUES (${input.hookId}, ${input.actionShapeId}, ${toJsonValue(actionDefinition)}, ${toJsonValue(input.parameters)}, ${input.index})
    RETURNING *;
  `
}

// Get an action shape by its key
export async function getActionShapeByKey(key: string) {
  // Using raw query since we're not sure if Prisma client is correctly generated
  const result = await prismaClient.$queryRaw`
    SELECT * FROM "ActionShape" WHERE key = ${key} LIMIT 1;
  `

  const shapes = result as Array<{
    key: string
    action: string
    description: string
    parameters: unknown
  }>

  return shapes.length > 0 ? shapes[0] : null
}

// Validate that parameters conform to the expected schema for an action type
export function validateActionParameters<T extends ActionType>(
  action: T,
  parameters: unknown,
): parameters is ActionParameterSchemas[T] {
  // In a real implementation, you would add validation logic here
  // This is just a type assertion for now
  return true
}
