import "server-only"
import type { Credit, Prisma } from "@prisma/client"
import { prismaClient } from "../index"
import type { ListQuery } from "../types"

interface CreditsQuery extends ListQuery {
  providerId?: string
  initiativeid?: string
}

export async function getCredits(query: CreditsQuery) {
  let where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  //let include = {}

  if (query?.providerId) {
    where = { providerId: query.providerId }
  } else if (query?.initiativeid) {
    where = { initiativeId: query.initiativeid }
  }

  const filter = { where, skip, take, orderBy }
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
  const result = await prismaClient.credit.findMany(filter)
  return result
}

export async function getCreditById(id: string) {
  const result = await prismaClient.credit.findUnique({ where: { id } })
  return result
}

export async function newCredit(data: Prisma.CreditCreateInput) {
  const result = await prismaClient.credit.create({ data })
  return result
}

export function updateCredit(id: string, data: Prisma.CreditUpdateInput) {
  return prismaClient.credit.update({ where: { id }, data })
}
