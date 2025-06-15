import { auth } from "@cfce/auth"
import { prismaClient } from "@cfce/database"
import { redirect } from "next/navigation"
import { verifyOrgAccess } from "~/utils/verifyOrgAccess"
import { HooksManagementClient } from "./client"

interface PageProps {
  params: Promise<{ orgId: string }>
}

export default async function HooksPage({ params }: PageProps) {
  const { orgId } = await params
  const session = await auth()
  if (
    !session ||
    !session.user ||
    !orgId ||
    typeof session.user.id !== "string"
  ) {
    return null
  }
  await verifyOrgAccess(session.user.id as string, orgId, !!session.isAdmin)

  // Fetch all hooks for the organization
  const hooks = await prismaClient.hook.findMany({
    where: {
      orgId,
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

      <HooksManagementClient organizationId={orgId} initialHooks={hooks} />
    </div>
  )
}
