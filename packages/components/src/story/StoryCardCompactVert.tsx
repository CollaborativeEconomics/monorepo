"use client"
import appConfig from "@cfce/app-config"
import { chainConfig, getNftPath } from "@cfce/blockchain-tools"
import type { StoryWithRelations } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils"
import { format } from "date-fns"
import { ExternalLinkIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import OrganizationAvatar from "~/organization/OrganizationAvatar"
import { Button } from "~/ui/button"
import { Card, CardContent } from "~/ui/card"
import { DateDisplay } from "~/ui/date-posted"
import { FlipCard } from "~/ui/flip-card"
import { NFTMetadataCard } from "./NFTMetadataCard"

const IPFSURL = appConfig.apis.ipfs.gateway

interface StoryCardCompactVertProps {
  story: StoryWithRelations
}

interface CardSideProps {
  onFlip?: () => void
}

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

export default function StoryCardCompactVert(props: StoryCardCompactVertProps) {
  const story = props?.story
  if (!story) {
    return null
  }

  const organization = story.organization
  const initiative = story.initiative
  const image = story.image
    ? story.image.startsWith("ipfs:")
      ? IPFSURL + story.image.substr(5)
      : story.image
    : "/nopic.png"

  const CardFront: React.FC<CardSideProps> = ({ onFlip }) => (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <div className="relative min-w-[150px] w-full h-[200px]">
        <Link href={`/stories/${story.id}`}>
          <Image
            className="object-cover"
            src={ipfsCIDToUrl(image)}
            alt="IMG BG"
            style={{ objectFit: "cover" }}
            fill
          />
        </Link>
      </div>
      <CardContent className="flex flex-col flex-1 overflow-hidden gap-3">
        <div className="gap-2 pt-4">
          <div className="inline-flex gap-2 items-center">
            <OrganizationAvatar organization={organization} />
            <button type="button" onClick={onFlip}>
              <img src="/media/icon-nft.svg" alt="NFT" className="w-10 h-10" />
            </button>
          </div>
          <p className="text-sm font-semibold truncate">
            in{" "}
            <span className="underline">
              <Link href={`/initiatives/${initiative?.id}`}>
                {initiative?.title}
              </Link>
            </span>
          </p>
        </div>
        <DateDisplay
          timestamp={new Date(story.created).getTime()}
          className="pl-6"
        />
        <div className="pl-6 line-clamp-2 text-left">{story.description}</div>
      </CardContent>
    </Card>
  )

  const CardBack: React.FC<CardSideProps> = ({ onFlip }) => (
    <NFTMetadataCard story={story} onFlip={onFlip} />
  )

  return (
    <div className="block w-full">
      <span className="text-sm text-muted-foreground block mb-2">
        {format(new Date(story.created), "MMM d, yyyy")}
      </span>
      <FlipCard front={CardFront} back={CardBack} />
    </div>
  )
}
