import "server-only"
import type { TriggerName } from "@prisma/client"
import { prismaClient } from "../index"

export async function createHook({
  triggerName,
  orgId,
  description,
}: { triggerName: TriggerName; orgId: string; description: string }) {
  const hook = await prismaClient.hook.create({
    data: { triggerName, orgId, description },
  })
  return hook
}

export async function getHookByTriggerAndOrg(
  triggerName: TriggerName,
  orgId: string,
) {
  // Fetch the first hook that matches the given trigger name and organization ID
  // and include its associated actions ordered by a specific field
  const hook = await prismaClient.hook.findFirst({
    where: {
      triggerName: triggerName,
      orgId: orgId,
    },
    include: {
      actions: {
        orderBy: {
          index: "asc",
        },
      },
    },
  })

  return hook
}

export async function deleteHook(hookId: string) {
  await prismaClient.hook.delete({
    where: {
      id: hookId,
    },
  })
}
