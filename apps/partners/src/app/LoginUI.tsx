"use client"

import appConfig from "@cfce/app-config"
import { AuthButton } from "@cfce/auth"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@cfce/components/ui"
import Image from "next/image"

export function LoginUI() {
  const enabledAuthMethods = appConfig.auth

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            {/* Add your logo here */}
            <Image
              src="/give-logo.svg"
              alt="Partners Logo"
              width={250}
              height={80}
              className="mb-4"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Partner Portal Login
          </CardTitle>
          <p className="text-center text-slate-400">
            Sign in to access your organization's dashboard
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full flex flex-col gap-4">
            <Separator className="my-4 bg-slate-700" />
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
