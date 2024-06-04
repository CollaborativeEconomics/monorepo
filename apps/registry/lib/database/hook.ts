import prismaClient from "prisma/client";
import { Hook } from "prisma/models";

export async function getHookByTriggerAndOrg(triggerName: string, orgId: string): Promise<Hook | null> {
  // Fetch the first hook that matches the given trigger name and organization ID
  // and include its associated actions ordered by a specific field
  const hook = await prismaClient.Hook.findFirst({
    where: {
      triggerName: triggerName,
      orgId: orgId 
    },
    include: {
      actions: {
        orderBy: {
          id: 'desc'
        }
      }
    }
  });

  return hook;
}