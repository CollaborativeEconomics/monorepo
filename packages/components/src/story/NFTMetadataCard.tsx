import appConfig, { chainConfig } from "@cfce/app-config"
import { getNftPath } from "@cfce/blockchain-tools"
import type { StoryWithRelations } from "@cfce/database"
import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "~/ui/button"
import { Card, CardContent } from "~/ui/card"

interface JsonLineProps {
  label: string
  value: string | number
  isLast?: boolean
}

const JsonLine: React.FC<JsonLineProps> = ({
  label,
  value,
  isLast = false,
}) => {
  const formattedValue = typeof value === "string" ? `"${value}"` : value
  const comma = isLast ? "" : ","

  return (
    <p className="flex">
      <span className="whitespace-nowrap">{`"${label}": `}</span>
      <span className="break-word pl-2">{`${formattedValue}${comma}`}</span>
    </p>
  )
}

interface NFTMetadataCardProps {
  story: StoryWithRelations
  onFlip?: () => void
}

export function NFTMetadataCard({ story, onFlip }: NFTMetadataCardProps) {
  const organization = story.organization
  const initiative = story.initiative
  const image = story.image ?? "/nopic.png"

  const nftPath = getNftPath({
    chain: "xdc",
    network: appConfig.chainDefaults.network,
    contractType: "StoryNFT",
    tokenId: story?.tokenId ?? "",
  })

  const metadata: Array<{ label: string; value: string | number | null }> = [
    { label: "mintedBy", value: "CFCE via Give" },
    { label: "title", value: "Impact NFT" },
    { label: "created", value: new Date(story.created).toISOString() },
    { label: "organization", value: organization?.name ?? "" },
    { label: "initiative", value: initiative?.title ?? "" },
    { label: "event", value: story.name ?? "" },
    { label: "description", value: story.description },
    { label: "amount", value: story.amount },
    { label: "unitValue", value: story.unitvalue },
    { label: "unitLabel", value: story.unitlabel },
    { label: "image", value: image },
    { label: "metadata", value: story.metadata },
  ]

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden bg-[#261d0f] text-[#89c28d]">
      <CardContent className="flex-1 p-0 pt-6 font-mono text-sm overflow-hidden">
        <div className="h-full flex flex-col space-y-4">
          <div className="flex justify-between items-center px-6">
            <Link href={nftPath} target="_blank">
              <span className="text-[#ffd700] inline-flex items-center gap-1">
                NFT Metadata
                <ExternalLinkIcon className="w-4 h-4" />
              </span>
            </Link>
            <Button
              variant="ghost"
              onClick={onFlip}
              className="text-[#ffa07a] hover:text-[#ffd700] hover:bg-[#3d2218]"
            >
              Back
            </Button>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden pb-6 px-6">
            {metadata.map((item, index) => (
              <JsonLine
                key={item.label}
                label={item.label}
                value={item.value ?? ""}
                isLast={index === metadata.length - 1}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
