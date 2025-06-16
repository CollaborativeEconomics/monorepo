import { auth } from "@cfce/auth"
import { getOrganizationsByUserId } from "@cfce/database"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/organization/new")
  }
  const orgs = await getOrganizationsByUserId(session.user.id)
  if (orgs && orgs.length > 0) {
    redirect(`/organization/${orgs[0].id}`)
  } else {
    redirect("/organization/new")
  }
}
