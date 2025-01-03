import appConfig from "@cfce/app-config"
import type { StoryWithRelations } from "@cfce/database"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import OrganizationAvatar from "~/organization/OrganizationAvatar"
import { Card, CardContent } from "~/ui/card"
import { DateDisplay } from "~/ui/date-posted"
import { imageUrl } from "@cfce/utils"

const IPFSURL = appConfig.apis.ipfs.gateway

interface StoryCardCompactVertProps {
  story: StoryWithRelations
}

export default function StoryCardCompactVert(props: StoryCardCompactVertProps) {
  const story = props?.story
  if (!story) {
    return
  }
  const organization = story.organization
  const initiative = story.initiative
  const image = story.image
    ? story.image.startsWith("ipfs:")
      ? IPFSURL + story.image.substr(5)
      : story.image
    : "/nopic.png"

  return (
    <Card className="flex flex-col overflow-hidden h-auto mx-2">
      <div className="relative min-w-[150px] w-full h-[200px]">
        <Link href={`/stories/${story.id}`}>
          <Image
            className="object-cover"
            src={imageUrl(image)}
            alt="IMG BG"
            style={{ objectFit: "cover" }}
            fill
          />
        </Link>
      </div>
      <CardContent className="flex flex-col overflow-hidden gap-3">
        <div className="inline-flex flex-wrap items-top pl-6 gap-x-4 pt-4">
          <OrganizationAvatar
            className="flex-wrap"
            name={organization?.name}
            image={imageUrl(organization?.image)}
          />
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
}
