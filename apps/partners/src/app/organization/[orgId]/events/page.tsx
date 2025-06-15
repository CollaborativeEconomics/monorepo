import { auth } from "@cfce/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import {
  getEventsByOrganization,
  getOrganizationById,
} from "~/actions/database"
import { verifyOrgAccess } from "~/utils/verifyOrgAccess"
import EventsClient from "./events-client"

interface PageProps {
  params: Promise<{ orgId: string }>
}

export default async function Page({ params }: PageProps) {
  const session = await auth()
  const { orgId } = await params
  if (
    !session ||
    !session.user ||
    !orgId ||
    typeof session.user.id !== "string"
  ) {
    return null
  }
  await verifyOrgAccess(session.user.id as string, orgId, !!session.isAdmin)
  const orgData = (await getOrganizationById(orgId)) || {}
  const evtData = (await getEventsByOrganization(orgId)) || []
  const organization = JSON.parse(JSON.stringify(orgData))
  const events = JSON.parse(JSON.stringify(evtData))
  console.log("ORG:", organization?.name)
  console.log("EVT:", events.length)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsClient organization={organization} events={events} />
    </Suspense>
  )
}
