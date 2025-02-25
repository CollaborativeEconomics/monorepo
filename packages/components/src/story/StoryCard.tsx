"use client"
import type { StoryWithRelations } from "@cfce/database"
import Link from "next/link"
import React from "react"
import OrganizationAvatar from "~/organization/OrganizationAvatar"
import { Card, CardContent, CardFooter, CardHeader } from "~/ui/card"
import DateDisplay from "~/ui/date-posted"
import { FlipCard } from "~/ui/flip-card"
import Gallery from "~/ui/gallery"
import { Separator } from "../ui"
import { NFTMetadataCard } from "./NFTMetadataCard"

interface StoryCardProps {
  story: StoryWithRelations
}

interface CardSideProps {
  onFlip?: () => void
}

export default function StoryCard(props: StoryCardProps) {
  const story = props?.story
  if (!story) {
    return null
  }

  const organization = story.organization
  const initiative = story.initiative
  const media = story.media.map((it) => it.media)
  if (story.image) {
    media.unshift(story.image)
  }

  const CardFront: React.FC<CardSideProps> = ({ onFlip }) => (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 pt-6">
          <div className="flex justify-between items-center">
            <DateDisplay timestamp={new Date(story.created).getTime()} />
            <button type="button" onClick={onFlip}>
              <img src="/media/icon-nft.svg" alt="NFT" className="w-10 h-10" />
            </button>
          </div>
        </CardHeader>
        <Link href={`/stories/${story.id}`}>
          <div className="px-4">
            <Gallery images={media} />
          </div>
          <CardContent className="flex flex-col p-4 gap-3">
            <p>{story.description}</p>
          </CardContent>
        </Link>
      </div>
      <div>
        <Separator />
        <CardFooter className="flex-col gap-2 p-4 pb-6 self-start items-start">
          <OrganizationAvatar organization={organization} />
          <p className="text-sm font-semibold">
            in{" "}
            <span className="underline">
              <Link href={`/initiatives/${initiative?.id}`}>
                {initiative?.title}
              </Link>
            </span>
          </p>
        </CardFooter>
      </div>
    </Card>
  )

  const CardBack: React.FC<CardSideProps> = ({ onFlip }) => (
    <NFTMetadataCard story={story} onFlip={onFlip} />
  )

  return <FlipCard front={CardFront} back={CardBack} />
}
