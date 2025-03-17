import { auth } from "@cfce/auth"
import { prismaClient } from "@cfce/database"
import { redirect } from "next/navigation"
import { HooksManagementClient } from "./client"

export default async function HooksPage() {
  const session = await auth()

  if (!session?.user || !session.orgId) {
    redirect("/auth/signin?callbackUrl=/dashboard/hooks")
  }

  // Fetch all hooks for the organization
  const hooks = await prismaClient.hook.findMany({
    where: {
      orgId: session.orgId,
    },
    include: {
      actions: {
        orderBy: {
          index: "asc",
        },
      },
    },
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Hooks Management</h1>
      <p className="mb-6 text-gray-600">
        Configure hooks to automate actions when specific events occur in your
        organization.
      </p>

      <HooksManagementClient
        organizationId={session.orgId}
        initialHooks={hooks}
      />
    </div>
  )
}
