import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@cfce/components/ui"
import type { InitiativeWithRelations } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils"
import { AlertCircle, Calendar, Copy } from "lucide-react"
import { useState } from "react"

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center justify-between">
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-4 text-primary-foreground hover:text-white focus:outline-none"
      >
        ×
      </button>
    </div>
  )
}

// Format date to a more readable format
function formatDate(dateString: Date) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Check if a compatible wallet exists for a given chain
function hasCompatibleWallet(
  initiative: InitiativeWithRelations,
  chain: string,
  network = "mainnet",
) {
  // Check initiative wallets
  const hasInitiativeWallet = initiative.wallets?.some(
    (w) =>
      w.chain.toLowerCase() === chain.toLowerCase() && w.network === network,
  )

  // Check organization wallets
  const hasOrgWallet = initiative.organization?.wallets?.some(
    (w) =>
      w.chain.toLowerCase() === chain.toLowerCase() && w.network === network,
  )

  return hasInitiativeWallet || hasOrgWallet
}

export function InitiativeCard({
  initiative,
}: { initiative: InitiativeWithRelations }) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Check wallet compatibility
  const hasBaseWallet = hasCompatibleWallet(initiative, "base")
  const hasArbitrumWallet = hasCompatibleWallet(initiative, "arbitrum")

  // Helper function to generate initiative URI
  function getInitiativeUri(initiativeId: string, chain?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000"

    // Use query parameter format for chain
    const basePath = `${baseUrl}/api/initiative/${initiativeId}`

    // If chain is specified, add it as a query parameter
    if (chain) {
      return `${basePath}?chain=${chain}`
    }

    return basePath
  }

  const baseLink = getInitiativeUri(initiative.id)
  const arbitrumLink = getInitiativeUri(initiative.id, "Arbitrum")

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
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-card-foreground">
                {initiative.title}
              </h2>
            </div>
            <p className="text-muted-foreground font-medium">
              Organization:{" "}
              {initiative.organization?.name || initiative.organizationId}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Created: {formatDate(initiative.created)}</span>
            </div>
          </div>

          {initiative.imageUri && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={ipfsCIDToUrl(initiative.imageUri)}
                alt={initiative.title}
                width={120}
                height={120}
                className="rounded-md object-cover h-[120px] w-[120px]"
              />
            </div>
          )}
        </div>

        {initiative.description && (
          <p className="text-foreground mt-2 mb-4">{initiative.description}</p>
        )}

        {initiative.status && (
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                String(initiative.status) === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : String(initiative.status) === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-secondary text-secondary-foreground"
              }`}
            >
              {initiative.status}
            </span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-secondary space-y-3">
          <div className="flex items-center">
            <div className="flex-grow">
              <div className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                Base Link
                <TooltipProvider>
                  {!hasBaseWallet && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>No Base network wallet connected</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
              <div className="flex items-stretch">
                <input
                  type="text"
                  value={baseLink}
                  readOnly
                  className="flex-grow px-3 py-2 bg-accent text-foreground rounded-l-md border border-accent focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(baseLink, "Base")}
                  className="px-3 py-2 bg-accent rounded-r-md border border-accent hover:bg-accent/80 transition-colors"
                  aria-label="Copy Base Link"
                >
                  <Copy className="w-4 h-4 text-accent-foreground" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-grow">
              <div className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                Arbitrum Link
                <TooltipProvider>
                  {!hasArbitrumWallet && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>No Arbitrum network wallet connected</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
              <div className="flex items-stretch">
                <input
                  type="text"
                  value={arbitrumLink}
                  readOnly
                  className="flex-grow px-3 py-2 bg-accent text-foreground rounded-l-md border border-accent focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(arbitrumLink, "Arbitrum")}
                  className="px-3 py-2 bg-accent rounded-r-md border border-accent hover:bg-accent/80 transition-colors"
                  aria-label="Copy Arbitrum Link"
                >
                  <Copy className="w-4 h-4 text-accent-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
