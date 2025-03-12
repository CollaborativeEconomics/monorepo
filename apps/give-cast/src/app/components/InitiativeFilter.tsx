"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@cfce/components/ui"
import type { InitiativeWithRelations } from "@cfce/database"
import { Filter, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { InitiativeCard } from "./InitiativeCard"

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
      <div className="space-y-8">
        <div className="relative max-w-xl mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-10 bg-secondary rounded w-full" />
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-card rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-3 w-2/3">
                  <div className="h-6 bg-secondary rounded" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-3 bg-secondary rounded w-1/4" />
                </div>
                <div className="w-24 h-24 bg-secondary rounded" />
              </div>
              <div className="mt-4 pt-4 border-t border-secondary">
                <div className="h-20 bg-secondary rounded mb-4" />
                <div className="flex justify-end gap-3">
                  <div className="h-10 bg-secondary rounded w-24" />
                  <div className="h-10 bg-secondary rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 pt-4 pb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-input rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            placeholder="Search initiatives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <div className="flex items-center mr-4 border-l border-input pl-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-sm text-foreground focus:outline-none">
                  <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                  <span>
                    {sortBy === "newest" ? "Newest First" : "Alphabetical"}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={(value) =>
                      setSortBy(value as "newest" | "alphabetical")
                    }
                  >
                    <DropdownMenuRadioItem value="newest">
                      Newest First
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="alphabetical">
                      Alphabetical
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        {processedInitiatives.length > 0 ? (
          processedInitiatives.map((initiative) => (
            <InitiativeCard key={initiative.id} initiative={initiative} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No initiatives found matching your search.
            </p>
          </div>
        )}
      </div>

      <div className="text-center text-muted-foreground text-sm pt-4">
        Showing {processedInitiatives.length} of {initiatives.length}{" "}
        initiatives
      </div>
    </div>
  )
}
