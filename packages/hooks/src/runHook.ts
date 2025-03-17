import { getHookByTriggerAndOrg } from "@cfce/database"
import type {
  Action,
  ActionContext,
  ActionName,
  ActionToParamsMap,
  ContextParams,
  TriggerName,
} from "@cfce/types"
import actions from "./actions"

const createBaseContext: () => ActionContext = () => ({
  date: Date.now(),
})

/**
 * Normalizes a database action into a properly typed Action
 * This is a boundary function that ensures type safety for the rest of the application
 */
function normalizeAction<T extends ActionName>(action: Action): Action<T> {
  // Get action name from either direct property or actionDefinition
  const actionName = action.action || action?.action
  if (!actionName) {
    throw new Error("Action name is missing")
  }

  // Extract other properties with fallbacks
  const key = action.key || action?.key || ""
  const description = action.description || action?.description || ""
  const parameters = action.parameters || action?.parameters || {}
  const index = action.index

  // Create and return a properly typed Action
  return {
    key,
    action: actionName as T,
    parameters: parameters as ActionToParamsMap[T],
    description,
    index,
  }
}

/**
 * Executes a single action with proper type safety
 */
async function executeAction(
  action: Action<ActionName>,
  context: ActionContext,
): Promise<unknown> {
  const actionName = action.action

  // Use a switch statement to ensure type safety for each action type
  switch (actionName) {
    case "FetchDataFromApi":
      return actions.FetchDataFromApi(
        context,
        action.parameters as ActionToParamsMap["FetchDataFromApi"],
      )
    case "Math":
      return actions.Math(
        context,
        action.parameters as ActionToParamsMap["Math"],
      )
    case "Transform":
      return actions.Transform(
        context,
        action.parameters as ActionToParamsMap["Transform"],
      )
    case "TransformEach":
      return actions.TransformEach(
        context,
        action.parameters as ActionToParamsMap["TransformEach"],
      )
    case "CreateStory":
      return actions.CreateStory(
        context,
        action.parameters as ActionToParamsMap["CreateStory"],
      )
    case "CreateStories":
      return actions.CreateStories(
        context,
        action.parameters as ActionToParamsMap["CreateStories"],
      )
    case "Find":
      return actions.Find(
        context,
        action.parameters as ActionToParamsMap["Find"],
      )
    case "Filter":
      return actions.Filter(
        context,
        action.parameters as ActionToParamsMap["Filter"],
      )
    case "InputValues":
      return actions.InputValues(
        context,
        action.parameters as ActionToParamsMap["InputValues"],
      )
    case "FormatDate":
      return actions.FormatDate(
        context,
        action.parameters as ActionToParamsMap["FormatDate"],
      )
    default:
      throw new Error(`Unknown action type: ${actionName}`)
  }
}

/**
 * Recursively executes a list of actions
 */
async function executeHookActions(
  actionsList: Action<ActionName>[],
  currentContext: ActionContext,
  index = 0,
): Promise<ActionContext> {
  // Base case: If we've executed all actions, return the final context
  if (index >= actionsList.length) {
    return currentContext
  }

  const currentAction = actionsList[index]

  try {
    // Execute the current action
    const result = await executeAction(currentAction, currentContext)

    // Recursively execute the next action with updated context
    return executeHookActions(
      actionsList,
      {
        ...currentContext,
        [currentAction.key]: result,
      },
      index + 1,
    )
  } catch (error) {
    console.error(`Error executing action ${currentAction.action}:`, error)
    // Continue with next action even if this one failed
    return executeHookActions(actionsList, currentContext, index + 1)
  }
}

/**
 * Runs a hook for a given trigger and organization
 */
const runHook = async (
  triggerName: TriggerName,
  orgId: string,
  inputContext: ContextParams,
): Promise<ActionContext> => {
  const hook = await getHookByTriggerAndOrg(triggerName, orgId)
  const baseContext = createBaseContext()
  const context = { ...baseContext, ...inputContext }

  if (!hook) {
    console.log(`No hook found for org ${orgId} and trigger ${triggerName}`)
    return context
  }

  try {
    // Convert database actions to properly typed actions
    // @ts-expect-error - TODO: fix this
    const typedActions = hook.actions.map((action) => normalizeAction(action))

    // Execute the actions with type safety
    return await executeHookActions(typedActions, {
      input: context,
    })
  } catch (error) {
    console.error("Error processing hook:", error)
    // Return the input context if there's an error
    return { input: context }
  }
}

export default runHook
