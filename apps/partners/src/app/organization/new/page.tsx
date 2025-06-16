import { auth } from "@cfce/auth"
import { getCategories } from "@cfce/database"
import OrganizationForm from "~/components/OrganizationForm"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { FormMode } from "~/types/data"
import { sortCategories } from "~/utils/data"

export default async function NewOrganizationPage() {
  const session = await auth()
  if (!session) return null
  const categories = sortCategories(await getCategories({}))
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>New Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            organization={{ name: "", description: "", email: "" }}
            categories={categories}
            formMode={FormMode.New}
            session={session}
          />
        </CardContent>
      </Card>
    </div>
  )
}
