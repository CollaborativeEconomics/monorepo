import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Prisma } from "@prisma/client"
import { prismaClient } from ".."

interface DonationQuery extends ListQuery {
  id?: string
  orgId?: string
  chapterid?: string
  initid?: string
  userId?: string
  storyId?: string
  wallet?: string
  from?: string
  to?: string
  favs?: string
  badges?: string
}

export type DonationWithRelations = Prisma.DonationGetPayload<{
  include: { organization: true; initiative: true }
}>

export async function getDonations(query: DonationQuery) {
  const filter: Prisma.DonationFindManyArgs = {
    skip: 0,
    take: 100,
    orderBy: { created: "desc" },
  }
  filter.where = {}

  if (query?.favs) {
    const userId = query.favs
    filter.distinct = ["organizationId"]
    // filter.select = {
    //   organization: true,
    // }
    filter.where = {
      userId: userId,
    }
  }

  if (query?.badges) {
    const userId = query.badges
    filter.distinct = ["categoryId"]
    // filter.select = {
    //   category: true,
    // }
    filter.where = {
      userId: userId,
    }
  }

  if (query?.orgId) {
    filter.where.organizationId = query.orgId
  }

  if (query?.chapterid) {
    filter.where.chapterId = query.chapterid
  }

  if (query?.initid) {
    filter.where.initiativeId = query.initid
  }

  if (query?.userId) {
    filter.where.userId = query.userId
  }

  if (query?.storyId) {
    filter.where.storyId = query.storyId
  }

  if (query?.wallet) {
    filter.where.wallet = {
      equals: query.wallet,
      mode: "insensitive",
    }
  }

  if (query?.from && query?.to) {
    filter.where.created = {
      gte: new Date(query.from), // .toISOString()
      lte: new Date(query.to),
    }
  }

  /*
      where: {
        date: {
          lte: 2022-01-30,
          gte: 2022-01-15,
        },
      }
  */

  if (query?.page || query?.size) {
    let page = Number.parseInt(query.page || "0")
    let size = Number.parseInt(query.size || "100")
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
  }
  const data = await prismaClient.donation.findMany({
    ...filter,
    include: {
      category: true,
      organization: true,
      initiative: true,
    },
  })

  return data
}

export async function getDonationById(
  id: string,
  include: Prisma.DonationInclude = {},
) {
  const data = await prismaClient.donation.findUnique({
    where: { id },
    include,
  })
  return data
}

export async function newDonation(data: Prisma.DonationCreateInput) {
  const rec = await prismaClient.donation.create({ data })
  console.log("NEW DONATION", rec)
  return rec
}
