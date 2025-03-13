import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BaseLayout } from "@cfce/components/app"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Give Cast",
  description: "Farcaster frame for giving",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <BaseLayout>{children}</BaseLayout>
}
