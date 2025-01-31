import type { StoryWithRelations } from "@cfce/database"
import Link from "next/link"
import React from "react"
import OrganizationAvatar from "~/organization/OrganizationAvatar"
import { Card, CardContent, CardFooter, CardHeader } from "~/ui/card"
import DateDisplay from "~/ui/date-posted"
import Gallery from "~/ui/gallery"
import { Separator } from "../ui"

interface StoryCardProps {
  story: StoryWithRelations
}

export default function StoryCard(props: StoryCardProps) {
  const story = props?.story
  if (!story) {
    return
  }
  const organization = story.organization
  const initiative = story.initiative
  const media = story.media.map((it) => it.media) // flatten list
  if (story.image) {
    media.unshift(story.image) // main image to the top
  }

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 pt-6">
          <DateDisplay timestamp={new Date(story.created).getTime()} />
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
}
