import React from "react"

import { OrganizationAvatar } from "@cfce/components/organization"
import {
  Card,
  CardContent,
  CardHeader,
  DateDisplay,
  Gallery,
  ShareModal,
} from "@cfce/components/ui"
import { getStoryById } from "@cfce/database"
import Image from "next/image"
import NotFound from "../../not-found"

export default async function Story(props: {
  params: Promise<{ id: string }>
}) {
  const storyid = (await props.params).id
  const story = await getStoryById(storyid)
  if (!story) {
    return <NotFound />
  }

  const media = story.media.map((it) => it.media) // flatten list
  const image = story.image ? [story.image] : []
  media.unshift(...image) // main image to the top

  return (
    <main className="flex min-h-screen flex-col items-stretch container pt-24 max-w-[800px]">
      <CardHeader className="flex-row justify-between">
        <DateDisplay timestamp={+story.created} className="py-4" />
        <ShareModal />
      </CardHeader>
      <Card className="flex flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <Gallery images={media} />
        </div>
        <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
          <h1 className="mt-4 text-4xl">{story.name}</h1>
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
    </main>
  )
}
