import React from "react"

import { CardHeader, DateDisplay, ShareModal } from "@cfce/components/ui"
import { getStoryById } from "@cfce/database"
import NotFound from "../../not-found"
import { StoryContent } from "./StoryContent"

export default async function Story(props: {
  params: Promise<{ id: string }>
}) {
  const storyid = (await props.params).id
  const story = await getStoryById(storyid)
  if (!story) {
    return <NotFound />
  }

  const media = story.media.map((it) => it.media)
  const image = story.image ? [story.image] : []
  media.unshift(...image)

  return (
    <main className="flex min-h-screen flex-col items-stretch container pt-24 max-w-[800px]">
      <CardHeader className="flex-row justify-between">
        <DateDisplay timestamp={+story.created} className="py-4" />
        <ShareModal />
      </CardHeader>
      <StoryContent story={story} media={media} />
    </main>
  )
}
