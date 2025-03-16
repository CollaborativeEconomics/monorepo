import type { Action, ActionName, ActionToParamsMap } from "@cfce/types"
import { Prisma } from "@prisma/client"
import { prismaClient } from ".."

export async function createHookAction<T extends ActionName>(
  hookId: string,
  action: Action<T>,
) {
  const hookAction = await prismaClient.action.create({
    data: {
      hookId,
      actionDefinition: {},
      ...action,
    },
  })
  return hookAction
}

export async function getActionsByHookId(hookId: string) {
  const actions = await prismaClient.action.findMany({
    where: {
      hookId,
    },
    orderBy: {
      index: "asc",
    },
  })
  return actions
}

export async function deleteHookAction(actionId: string) {
  await prismaClient.action.delete({
    where: {
      id: actionId,
    },
  })
}
