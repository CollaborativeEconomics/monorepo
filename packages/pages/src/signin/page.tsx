import React from "react"

import appConfig from "@cfce/app-config"
import { AuthButton, auth } from "@cfce/auth"
import { redirect } from "next/navigation"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@cfce/components/ui"

export default async function Signin() {
  //console.log('SIGN IN...')
  const session = await auth()
  //console.log('SESSION', session)

  // @ts-ignore: module augmentation is hard, TODO: fix this
  const userId = session?.user?.id

  if (userId) {
    redirect(`/profile/${userId}`)
  }

  const enabledAuthMethods = appConfig.auth

  return (
    <div className="container mx-auto mt-20">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full flex flex-col gap-4">
            <Separator className="my-4" />
            {enabledAuthMethods.map((method) => (
              <AuthButton
                className="w-full"
                key={`auth-button-${method}`}
                method={method}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
