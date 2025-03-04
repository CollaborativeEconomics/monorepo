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
    `${process.env.VERCEL_URL || "http://localhost:3000/api"}`,
  )
  return {
    other: frameTags,
  }
}

// Helper function at the top of the file, before the Home component
function getInitiativeUri(initiativeId: string, chain?: string) {
  const baseUrl = process.env.VERCEL_URL || "http://localhost:3000"

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
  const initiatives = await getInitiatives({})

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            GiveCast Deployment Interface
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Share non-profit initiatives as Farcaster Frames
          </p>
        </div>

        {/* Use the client-side filter component */}
        <InitiativeFilter initiatives={initiatives} />
      </div>
    </main>
  )
}
