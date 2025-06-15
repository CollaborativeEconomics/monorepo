import type { Action } from "@prisma/client"
import { prismaClient } from ".."

export async function createHookAction(
  hookId: string,
  { parameters, action, key, description, index }: Omit<Action, 'id' | 'hookId'>,
) {
  const hookAction = await prismaClient.action.create({
    data: {
      hookId,
      actionDefinition: {},
      action,
      key,
      parameters,
      description,
      index,
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
