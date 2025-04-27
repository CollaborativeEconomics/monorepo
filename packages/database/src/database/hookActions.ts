import type { Action, ActionName } from "@cfce/types"
import { prismaClient } from ".."

export async function createHookAction<T extends ActionName>(
  hookId: string,
  { parameters, action, key, description, index }: Action<T>,
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
