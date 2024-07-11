import { Prisma, Story } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "types"

interface StoryQuery extends ListQuery {
  orgId?: string
  initId?: string
  recent?: string
}

export async function getStories(query: StoryQuery): Promise<Story | Array<Story>> {
  let where = {}
  let include = {
    media: true,
    organization: true,
    initiative: {
      include: {
        category: true
      }
    }
  }
  let skip = 0
  let take = 100
  let orderBy = { created: 'desc' } as Prisma.StoryOrderByWithRelationInput

  if (query?.recent) {
    const qty = parseInt(query.recent) || 10
    const result = await prismaClient.story.findMany({ include, take: qty, orderBy: { created: 'desc' } })
    return result
  }

  if (query?.orgId) {
    where = { organizationId: query.orgId }
  } else if (query?.initId) {
    where = { initiativeId: query.initId }
  }

  let filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    //filter.orderBy = { name: 'asc' }
  }
  const result = await prismaClient.story.findMany(filter)
  return result
}

export async function getStoryById(id: string): Promise<Story | null> {
  const include = {
    media: true,
    organization: true,
    initiative: {
      include: {
        category: true
      }
    }
  }
  const result = await prismaClient.story.findUnique({ where: { id }, include })
  return result
}

export async function addStory(data: Story): Promise<Story> {
  console.log('DATA', data)
  const result = await prismaClient.story.create({ data })
  return result
}

export async function newStory({ organizationId, initiativeId, ...story }: Omit<Story, 'tokenId' | 'created' | 'categoryId'>): Promise<Story> {
  // Create the story DB entry with the data
  let dbStory = await prismaClient.story.create({
    data: {
      ...story,
      organization: {
        connect: { id: organizationId },
      },
      initiative: {
        connect: { id: initiativeId },
      }
    },
  })
  return dbStory
}

export async function updateStory(id: string, data: Partial<Story>): Promise<Story> {
  let result = await prismaClient.story.update({ where: { id }, data })
  console.log('UPDATE', result)
  return result
}
