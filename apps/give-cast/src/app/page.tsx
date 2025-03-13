import { Logo } from "@cfce/components/home"
import { getFrameMetadata } from "frog/web"
import type { Metadata } from "next"
import Image from "next/image"

import { type InitiativeWithRelations, getInitiatives } from "@cfce/database"
import { ExternalLink } from "lucide-react"

import styles from "./page.module.css"

// Import the client component for filtering
import { InitiativeFilter } from "./components/InitiativeFilter"

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000/api"}`,
  )
  return {
    other: frameTags,
  }
}

// Helper function at the top of the file, before the Home component
function getInitiativeUri(initiativeId: string, chain?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000"

  // Use route-based format instead of query parameters
  const basePath = `${baseUrl}/api/initiative/${initiativeId}`

  // If chain is specified, add it as a query parameter
  if (chain) {
    const params = new URLSearchParams({ chain })
    return `${basePath}?${params.toString()}`
  }

  return basePath
}

export default async function Home() {
  // Fetch initiatives with organization data
  let initiatives = await getInitiatives({})
  initiatives = JSON.parse(JSON.stringify(initiatives))

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Logo />
            <p className="ml-4 text-muted-foreground">
              Share non-profit initiatives as Farcaster Frames
            </p>
          </div>
        </div>

        {/* Use the client-side filter component */}
        <InitiativeFilter initiatives={initiatives} />
      </div>
    </main>
  )
}
