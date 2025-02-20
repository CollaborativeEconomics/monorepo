"use client"
import { OrganizationAvatar } from "@cfce/components/organization"
import { NFTMetadataCard } from "@cfce/components/story"
import { Card, CardContent, FlipCard, Gallery } from "@cfce/components/ui"
import type { StoryWithRelations } from "@cfce/database/types"
import Image from "next/image"

interface CardSideProps {
  onFlip?: () => void
}

interface StoryContentProps {
  story: StoryWithRelations
  media: string[]
}

export function StoryContent({ story, media }: StoryContentProps) {
  const CardFront: React.FC<CardSideProps> = ({ onFlip }) => (
    <Card className="flex flex-col overflow-hidden">
      <div className="px-4 pt-4">
        <Gallery images={media} />
      </div>
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
        <div className="flex justify-between items-start">
          <h1 className="mt-4 text-4xl">{story.name}</h1>
          <button type="button" onClick={onFlip} className="mt-4">
            <img src="/media/icon-nft.svg" alt="NFT" className="w-10 h-10" />
          </button>
        </div>
        <p className="">{story.description}</p>
        <div className="flex flex-row justify-between border-t mt-4 pt-4">
          <div>
            <p className="mb-4 text-sm font-semibold">
              <span>Posted in </span>
              <span className="underline">
                <a href={`/initiatives/${story.initiative.id}`}>
                  {story.initiative.title}
                </a>
              </span>
            </p>
            <OrganizationAvatar organization={story.organization} />
          </div>
          <div className="flex flex-col items-center">
            {story.initiative.category ? (
              <>
                {story.initiative.category?.image && (
                  <Image
                    src={story.initiative.category.image}
                    width={96}
                    height={96}
                    alt="Category"
                  />
                )}
                <h1 className="mt-2text-sm">
                  {story.initiative.category?.title}
                </h1>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CardBack: React.FC<CardSideProps> = ({ onFlip }) => (
    <NFTMetadataCard story={story} onFlip={onFlip} />
  )

  return <FlipCard front={CardFront} back={CardBack} />
}
