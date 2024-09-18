import "server-only"
import type { Prisma, StoryMedia } from "@prisma/client"
import type { ListQuery } from "@cfce/types"
import { prismaClient } from ".."

interface StoryMediaQuery extends ListQuery {}

export async function getStoryMedia(
  query: StoryMediaQuery,
): Promise<StoryMedia | Array<StoryMedia>> {
  const where = {}
  const skip = 0
  const take = 100
  //let orderBy = { created: 'desc' }
  //let include = {}

  const filter = { where, skip, take }
  if (query?.page || query?.size) {
    let page = Number.parseInt(query?.page || "0")
    let size = Number.parseInt(query?.size || "100")
    if (page < 0) {
      page = 0
    }
    if (size < 0) {
      size = 100
    }
    if (size > 200) {
      size = 200
    }
    const start = page * size
    filter.skip = start
    filter.take = size
    //filter.orderBy = { name: 'asc' }
  }
  const result = await prismaClient.storyMedia.findMany(filter)
  return result
}

export async function getStoryMediaById(
  id: string,
): Promise<StoryMedia | null> {
  const result = await prismaClient.storyMedia.findUnique({ where: { id } })
  return result
}

interface StoryMediaData {
  media: Array<{
    media: string
    mime: string
  }>
}

export async function addStoryMedia(
  id: string,
  images: StoryMediaData,
): Promise<Prisma.BatchPayload | null> {
  console.log("SPIX", id, images)
  if (images?.media?.length < 1) {
    return null
  }
  const data = images?.media?.map((it) => {
    return { storyId: id, media: it.media, mime: it.mime }
  })
  const result = await prismaClient.storyMedia.createMany({ data })
  return result
}
