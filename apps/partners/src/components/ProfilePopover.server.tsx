import { auth } from "@cfce/auth"
import { getOrganizationById } from "~/actions/database"
import { getOrganizationsByUserId, getOrganizations } from "@cfce/database"
import ProfilePopoverClient, { Organization, UserInfo } from "./ProfilePopover.client"
import { Session } from "next-auth"
import React from "react"

export default async function ProfilePopover() {
  const session: Session | null = await auth()
  if (!session || !session.user) return null
  console.log('SESSION', session)

  if (!session.user.id) return null

  let orgList: Organization[] = []
  if (session.isAdmin) {
    orgList = await getOrganizations({}) || []
  } else if (session.user.id) {
    orgList = await getOrganizationsByUserId(session.user.id) || []
  }
  console.log('ORG LIST', orgList)
  const organizations: Organization[] = Array.isArray(orgList)
    ? orgList.map((org: any) => ({ id: String(org.id), name: String(org.name) }))
    : []

  let currentOrg: Organization | null = null
  if (session.orgId) {
    const org = await getOrganizationById(session.orgId)
    if (org) currentOrg = { id: String(org.id), name: String(org.name) }
  }

  const user: UserInfo = {
    id: String(session.user.id),
    name: String(session.user.name || session.user.email || "User"),
    email: session.user.email ?? undefined,
    image: session.user.image ?? undefined,
  }

  return <ProfilePopoverClient user={user} organizations={organizations} currentOrg={currentOrg} />
} 