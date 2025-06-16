import { auth } from "@cfce/auth"
import { getCategories, getOrganizationById } from "@cfce/database"
import OrganizationForm from "~/components/OrganizationForm"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { FormMode } from "~/types/data"
import { sortCategories } from "~/utils/data"

interface PageProps {
  params: Promise<{ orgId: string }>
}

export default async function EditOrganizationPage({ params }: PageProps) {
  const session = await auth()
  const { orgId } = await params
  if (!session || !orgId) return null
  const organization = await getOrganizationById(orgId)
  if (!organization) return null
  const categories = sortCategories(await getCategories({}))

  function toOrganizationData(
    org: Record<string, unknown>,
  ): import("~/types/data").OrganizationData {
    return {
      name: org.name as string,
      slug: org.slug as string | undefined,
      description: (org.description as string) ?? "",
      email: (org.email as string) ?? "",
      EIN: org.EIN as string | undefined,
      phone: org.phone as string | undefined,
      mailingAddress: org.mailingAddress as string | undefined,
      country: org.country as string | undefined,
      imageUrl: org.imageUrl as string | undefined,
      backgroundUrl: org.backgroundUrl as string | undefined,
      url: org.url as string | undefined,
      twitter: org.twitter as string | undefined,
      facebook: org.facebook as string | undefined,
      categoryId: org.categoryId as string | undefined,
      ownerId: org.ownerId as string | undefined,
    }
  }
  const safeOrg = toOrganizationData(organization)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            id={orgId}
            organization={safeOrg}
            categories={categories}
            formMode={FormMode.Edit}
            session={session}
          />
        </CardContent>
      </Card>
    </div>
  )
}
