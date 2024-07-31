import type { Hook } from "@prisma/client"
import { prismaClient } from "../index"

export async function getHookByTriggerAndOrg(
  triggerName: string,
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
          id: "desc",
        },
      },
    },
  })

  return hook
}
