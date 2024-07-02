import { Offer } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "types"

interface OfferQuery extends ListQuery {
  id?: string
  sellerid?: string
  buyerid?: string
}

export async function getOffers(query: OfferQuery): Promise<Offer | Array<Offer>> {
  let where = {}
  let skip = 0
  let take = 100
  let unique = false
  let orderBy = {}
  let include = {
    collection: true,
    artwork: {
      include: { author: true }
    },
    seller: true,
    buyer: true,
    beneficiary: true
  }

  if (query?.sellerid) {
    where = { sellerId: query.sellerid }
  } else if (query?.buyerid) {
    where = { buyerId: query.buyerid }
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
    filter.orderBy = { created: query?.order || 'desc' }
  }
  let result = await prismaClient.offer.findMany(filter)
  return result
}

export async function getOfferById(id: string): Promise<Offer | null> {
  let result = await prismaClient.offer.findUnique({ where: { id } })
  return result
}

export async function newOffer(data: Offer): Promise<Offer> {
  let result = await prismaClient.offer.create({ data })
  return result
}

export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer> {
  let result = await prismaClient.offer.update({ where: { id }, data })
  return result
}

