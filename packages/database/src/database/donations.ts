import { prismaClient } from "index"
import { ListQuery } from "./types"
import { Donation, Prisma } from "@prisma/client"

interface DonationQuery extends ListQuery {
  id?: string
  orgid?: string
  chapterid?: string
  initid?: string
  userid?: string
  wallet?: string
  from?: string
  to?: string
  favs?: string
  badges?: string

}

export async function getDonations(query: DonationQuery): Promise<Donation | Array<Donation>> {
  const filter: Prisma.DonationFindManyArgs = {
    skip: 0,
    take: 100,
    include: {
      organization: true,
      initiative: true
    },
    orderBy: { created: 'desc' },
  }
  filter.where = {};

  if (query?.favs) {
    const userid = query.favs
    filter.distinct = ['organizationId'];
    filter.select = {
      organization: true,
    };
    filter.where = {
      userId: userid
    }
  }

  if (query?.badges) {
    const userid = query.badges
    filter.distinct = ['categoryId'];
    filter.select = {
      category: true,
    };
    filter.where = {
      userId: userid
    }
  }

  if (query?.orgid) {
    filter.where.organizationId = query.orgid
  }

  if (query?.chapterid) {
    filter.where.chapterId = query.chapterid
  }

  if (query?.initid) {
    filter.where.initiativeId = query.initid
  }

  if (query?.userid) {
    filter.where.userId = query.userid
  }

  if (query?.wallet) {
    filter.where.wallet = {
      equals: query.wallet,
      mode: 'insensitive'
    }
  }

  if (query?.from && query?.to) {
    filter.where.created = {
      gte: new Date(query.from),   // .toISOString()
      lte: new Date(query.to)
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
    let page = parseInt(query.page || '0')
    let size = parseInt(query.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
  }
  const data = await prismaClient.donation.findMany(filter)

  return data
}

export async function getDonationById(id: string): Promise<Donation | null> {
  const data = await prismaClient.donation.findUnique({ where: { id } })
  return data
}


export async function newDonation(data: Donation): Promise<Donation> {
  let rec = await prismaClient.donation.create({ data })
  console.log('NEW DONATION', rec)
  return rec
}

