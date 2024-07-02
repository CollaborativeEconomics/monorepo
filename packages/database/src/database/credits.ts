import { Credit } from "@prisma/client"
import { ListQuery } from "../types"
import { prismaClient } from "index"

interface CreditsQuery extends ListQuery {
  providerid?: string
  initiativeid?: string
}

export async function getCredits(query: CreditsQuery): Promise<Credit | Array<Credit>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  //let include = {}

  if (query?.providerid) {
    where = { providerId: query.providerid }
  } else if (query?.initiativeid) {
    where = { initiativeId: query.initiativeid }
  }

  let filter = { where, skip, take, orderBy }
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
  const  result = await prismaClient.credit.findMany(filter)
  return result
}

export async function getCreditById(id: string): Promise<Credit | null> {
  const  result = await prismaClient.credit.findUnique({ where: { id } })
  return result
}

export async function newCredit(data: Credit): Promise<Credit> {
  const  result = await prismaClient.credit.create({ data })
  return result
}

