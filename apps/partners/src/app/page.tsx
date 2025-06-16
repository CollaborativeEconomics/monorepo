import { auth } from "@cfce/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to the Partner Portal</CardTitle>
          <CardDescription>
            {session
              ? `You are signed in as ${session.user?.email || session.user?.name}.`
              : "Sign in to access your dashboard, manage your organization, and monitor your crypto donations."}
          </CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter className="flex flex-col gap-4">
          {!session ? (
            <Button asChild className="w-full">
              <Link href="/api/auth/signin">Sign in</Link>
            </Button>
          ) : (
            <Button asChild className="w-full" variant="secondary">
              <Link href="/organization">Enter Dashboard</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
