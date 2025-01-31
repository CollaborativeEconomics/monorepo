import React from "react"
import "~/styles/globals.css"

import appConfig from "@cfce/app-config"
import { BaseLayout } from "@cfce/components/app"
import { Footer, Header } from "@cfce/components/navigation"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: appConfig.siteInfo.title,
  description: "Watch your donations make an impact",
}

export const viewport: Viewport = { initialScale: 1.0, width: "device-width" }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BaseLayout>
      <Header />
      {children}
      <Footer />
    </BaseLayout>
  )
}
