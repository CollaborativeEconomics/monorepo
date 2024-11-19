import type { ListQuery } from "@cfce/types"
import type { Prisma, Story } from "@prisma/client"
import { prismaClient } from ".."

interface StoryQuery extends ListQuery {
  orgId?: string
  initId?: string
  recent?: number
}

export type StoryWithRelations = Prisma.StoryGetPayload<{
  include: {
    media: true
    organization: true
    initiative: { include: { category: true } }
  }
}>

export async function getStories(
  query: StoryQuery,
): Promise<Array<StoryWithRelations>> {
  let where = {}
  const include = {
    media: true,
    organization: true,
    initiative: {
      include: {
        category: true,
      },
    },
  }
  const skip = 0
  const take = 100
  const orderBy = { created: "desc" } as Prisma.StoryOrderByWithRelationInput

  if (query?.recent) {
    const qty = query.recent || 10
    const result = await prismaClient.story.findMany({
      include,
      take: qty,
      orderBy: { created: "desc" },
    })
    return result
  }

  if (query?.orgId) {
    where = { organizationId: query.orgId }
  } else if (query?.initId) {
    where = { initiativeId: query.initId }
  }

  const filter = { where, include, skip, take, orderBy }
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
  const result = await prismaClient.story.findMany(filter)
  return result
}

export async function getStoryById(
  id: string,
): Promise<StoryWithRelations | null> {
  const include = {
    media: true,
    organization: true,
    initiative: {
      include: {
        category: true,
      },
    },
  }
  const result = await prismaClient.story.findUnique({ where: { id }, include })
  return result
}

export async function addStory(data: Story): Promise<Story> {
  console.log("DATA", data)
  const result = await prismaClient.story.create({ data })
  return result
}

export async function newStory(story: Prisma.StoryCreateInput): Promise<Story> {
  // Create the story DB entry with the data
  const dbStory = await prismaClient.story.create({
    data: story,
  })
  return dbStory
}

export async function updateStory(
  id: string,
  data: Partial<Story>,
): Promise<Story> {
  const result = await prismaClient.story.update({ where: { id }, data })
  console.log("UPDATE", result)
  return result
}

export async function deleteStory(id: string): Promise<Story> {
  const result = await prismaClient.story.delete({ where: { id } })
  return result
}
