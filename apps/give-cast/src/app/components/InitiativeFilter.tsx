"use client"

import type { Initiative, InitiativeWithRelations } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils"
import { Calendar, Copy, ExternalLink, Filter, Search } from "lucide-react"
import { useEffect, useState } from "react"

// Format date to a more readable format
function formatDate(dateString: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateString)
}

// Simple Toast component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50 animate-fade-in-up">
      <span>{message}</span>
    </div>
  )
}

// Initiative Card Component - duplicated from page.tsx but as a client component
function InitiativeCard({
  initiative,
}: { initiative: InitiativeWithRelations }) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Helper function at the top of the file, before the Home component
  function getInitiativeUri(initiativeId: string, chain?: string) {
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"

    // Use route-based format instead of query parameters
    const basePath = `${baseUrl}/api/initiative/${initiativeId}`

    // If chain is specified, add it as a query parameter
    if (chain) {
      const params = new URLSearchParams({ chain })
      return `${basePath}?${params.toString()}`
    }

    return basePath
  }

  const baseLink = getInitiativeUri(initiative.id)
  const arbitrumLink = getInitiativeUri(initiative.id, "arbitrum")

  const copyToClipboard = (text: string, linkType: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setToastMessage(`${linkType} link copied to clipboard!`)
        setShowToast(true)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">
              {initiative.title}
            </h2>
            <p className="text-gray-600 font-medium">
              Organization:{" "}
              {initiative.organization?.name || initiative.organizationId}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Created: {formatDate(initiative.created)}</span>
            </div>
            {initiative.description && (
              <p className="text-gray-700 mt-2 line-clamp-2">
                {initiative.description}
              </p>
            )}
            {initiative.status && (
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    String(initiative.status) === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : String(initiative.status) === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {initiative.status}
                </span>
              </div>
            )}
          </div>

          {initiative.imageUri && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={ipfsCIDToUrl(initiative.imageUri)}
                alt={initiative.title}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center">
            <div className="flex-grow">
              <div className="text-sm font-medium text-blue-600 mb-1">
                Base Link
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={baseLink}
                  readOnly
                  className="flex-grow px-3 py-2 bg-blue-50 text-gray-700 rounded-l-md border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(baseLink, "Base")}
                  className="px-3 py-2 bg-blue-100 rounded-r-md border border-blue-100 hover:bg-blue-200 transition-colors"
                  aria-label="Copy Base Link"
                >
                  <Copy className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-grow">
              <div className="text-sm font-medium text-purple-600 mb-1">
                Arbitrum Link
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={arbitrumLink}
                  readOnly
                  className="flex-grow px-3 py-2 bg-purple-50 text-gray-700 rounded-l-md border border-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(arbitrumLink, "Arbitrum")}
                  className="px-3 py-2 bg-purple-100 rounded-r-md border border-purple-100 hover:bg-purple-200 transition-colors"
                  aria-label="Copy Arbitrum Link"
                >
                  <Copy className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InitiativeFilter({
  initiatives,
}: { initiatives: InitiativeWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "alphabetical">("newest")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Sort and filter initiatives
  const processedInitiatives = initiatives
    .filter((initiative) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        initiative.title.toLowerCase().includes(searchLower) ||
        initiative.organizationId.toLowerCase().includes(searchLower) ||
        initiative.description?.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      }
      return a.title.localeCompare(b.title)
    })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="relative max-w-md mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between">
                <div className="space-y-3 w-3/4">
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded" />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <div className="h-10 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search initiatives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 self-end">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "alphabetical")
            }
          >
            <option value="newest">Newest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {processedInitiatives.length > 0 ? (
          processedInitiatives.map((initiative) => (
            <InitiativeCard key={initiative.id} initiative={initiative} />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500 text-lg">
              No initiatives found matching your search.
            </p>
          </div>
        )}
      </div>

      <div className="text-center text-gray-500 text-sm pt-4">
        Showing {processedInitiatives.length} of {initiatives.length}{" "}
        initiatives
      </div>
    </div>
  )
}
