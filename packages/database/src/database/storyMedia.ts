import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Prisma, StoryMedia } from "@prisma/client"
import type { File } from "formidable"
import { prismaClient } from ".."

interface StoryMediaQuery extends ListQuery {
  // TODO: change this once we've moved everything to monorepo
  id?: string
}

export async function getStoryMedia(
  query: StoryMediaQuery,
): Promise<StoryMedia | Array<StoryMedia>> {
  const where = {} as Prisma.StoryMediaWhereInput
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
  if (query?.id) {
    filter.where.storyId = query.id
  }
  console.log("FILTER", filter)
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

export async function addStoryMedia(id: string, images: StoryMediaData) {
  console.log("SPIX", id, images)
  if (images?.media?.length < 1) {
    return null
  }
  const data = images?.media?.map((it) => {
    return { storyId: id, media: it.media, mime: it.mime }
  })
  const result = await prismaClient.storyMedia.createManyAndReturn({ data })
  return result
}

export async function deleteStoryMedia(id: string) {
  console.log("DELETE STORY MEDIA", id)
  const result = await prismaClient.storyMedia.delete({ where: { id } })
  return result
}

export async function deleteStoryMediaByStoryId(id: string) {
  const result = await prismaClient.storyMedia.deleteMany({
    where: { storyId: id },
  })
  return result
}
