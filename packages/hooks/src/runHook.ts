import { getHookByTriggerAndOrg } from "@cfce/database"
import actions from "./actions"
import type {
  ActionContext,
  Actions,
  ContextParams,
  TriggerName,
} from "./types"

const createBaseContext: () => ActionContext = () => ({
  date: Date.now(),
})

async function executeHookActions(
  actionsList: Actions[],
  currentContext: ActionContext,
  index = 0,
): Promise<ActionContext> {
  // Base case: If we've executed all actions, return the final data
  if (index >= actionsList.length) {
    return currentContext
  }

  const currentAction = actionsList[index].actionDefinition
  const actionFn = actions[currentAction.action]
  if (!actionFn) {
    throw new Error(`Action ${currentAction.action} not found.`)
  }

  // Execute the current action
  const nextContext = await actionFn(currentContext, currentAction.parameters)

  // Recursively execute the next action in the list
  return executeHookActions(
    actionsList,
    {
      ...currentContext,
      [currentAction.key]: nextContext,
    },
    index + 1,
  )
}

const runHook = async (
  triggerName: TriggerName,
  orgId: string,
  inputContext: ContextParams,
): Promise<ActionContext> => {
  const hook = await getHookByTriggerAndOrg(triggerName, orgId)
  const baseContext = createBaseContext()
  const context = { ...baseContext, ...inputContext }
  // console.log({ hook })
  if (!hook) {
    console.log(`No hook found for org ${orgId} and trigger ${triggerName}`)
    return context
  }
  // @ts-ignore ActionsDefinition actually is Json type
  // TODO: Figure out how to get prisma to recognize ActionDefinition type
  return await executeHookActions(hook.actions, { input: context })
}

export default runHook
