"use server"

import { prismaClient } from "@cfce/database"
import type { Prisma } from "@cfce/database"
import type { ActionName, ActionParams, TriggerName } from "@cfce/types"
import { revalidatePath } from "next/cache"

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Create a new hook
 */
export async function createHook({
  triggerName,
  orgId,
  description,
}: {
  triggerName: TriggerName
  orgId: string
  description?: string
}): Promise<ActionResult<{ id: string }>> {
  try {
    const hook = await prismaClient.hook.create({
      data: {
        triggerName,
        orgId,
        description,
      },
    })

    revalidatePath("/dashboard/hooks")
    return { success: true, data: { id: hook.id } }
  } catch (error) {
    console.error("Error creating hook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Delete a hook by ID
 */
export async function deleteHook(hookId: string): Promise<ActionResult> {
  try {
    // First delete all actions associated with this hook
    await prismaClient.action.deleteMany({
      where: { hookId },
    })

    // Then delete the hook
    await prismaClient.hook.delete({
      where: { id: hookId },
    })

    revalidatePath("/dashboard/hooks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting hook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Create a new action for a hook
 */
export async function createHookAction(
  hookId: string,
  action: {
    index: number
    key: string
    action: ActionName
    description?: string
    parameters: ActionParams
  },
): Promise<ActionResult<{ id: string }>> {
  try {
    const hookAction = await prismaClient.action.create({
      data: {
        hookId,
        index: action.index,
        key: action.key,
        action: action.action,
        description: action.description,
        parameters: action.parameters, // Prisma expects a JSON object
        actionDefinition: {},
      },
    })

    revalidatePath("/dashboard/hooks")
    return { success: true, data: { id: hookAction.id } }
  } catch (error) {
    console.error("Error creating hook action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Get all actions for a hook
 */
export async function getHookActions(hookId: string): Promise<
  ActionResult<
    Array<{
      id: string
      index: number
      key: string
      action: ActionName
      description?: string
      parameters: ActionParams
    }>
  >
> {
  try {
    const actions = await prismaClient.action.findMany({
      where: { hookId },
      orderBy: { index: "asc" },
    })

    return {
      success: true,
      data: actions.map((action) => ({
        id: action.id,
        index: action.index,
        key: action.key,
        action: action.action as ActionName,
        description: action.description || undefined,
        parameters: action.parameters,
      })),
    }
  } catch (error) {
    console.error("Error getting hook actions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: [],
    }
  }
}
