import { auth } from "@cfce/auth"
import { getOrganizationById } from "@cfce/database"
import Image from "next/image"
import Link from "next/link"
import OrganizationAvatar from "~/components/organizationavatar"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

interface PageProps {
  params: Promise<{ orgId: string }>
}

export default async function Page({ params }: PageProps) {
  const session = await auth()
  const { orgId } = await params
  let organization = null
  if (orgId) {
    organization = await getOrganizationById(orgId)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-3xl mx-auto p-0 overflow-hidden">
        {organization ? (
          <>
            {/* Banner with background image and overlay */}
            <div className="relative w-full h-64 md:h-80 flex items-end justify-center">
              {organization.background && (
                <Image
                  src={organization.background}
                  alt="Organization background"
                  fill
                  style={{ objectFit: "cover" }}
                  className="z-0"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="absolute left-0 right-0 bottom-6 flex flex-col items-center z-20">
                <OrganizationAvatar
                  image={organization.image ?? undefined}
                  name={organization.name}
                  className="justify-center"
                  avatarProps={{ size: "lg" }}
                />
              </div>
            </div>
            <CardHeader className="pt-8 pb-2 text-center">
              <CardTitle className="text-3xl font-bold mb-2">
                {organization.name}
              </CardTitle>
              <CardDescription className="text-lg mb-4">
                {organization.description}
              </CardDescription>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {organization.url && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={organization.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </Link>
                  </Button>
                )}
                {organization.twitter && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`https://twitter.com/${organization.twitter.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </Link>
                  </Button>
                )}
                {organization.facebook && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={organization.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-muted-foreground mb-2">
                Contact: {organization.email}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild className="w-full max-w-xs">
                <Link href={`/organization/${orgId}/edit`}>Edit</Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>No Organization Found</CardTitle>
              <CardDescription>Organization not found.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/organization/new">Create Organization</Link>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
