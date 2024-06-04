import prismaClient from "prisma/client"
import { Credit } from "prisma/models"

export async function getCredits(query): Promise<Credit | Array<Credit>> {
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
    let page = parseInt(query?.page || 0)
    let size = parseInt(query?.size || 100)
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    //filter.orderBy = { name: 'asc' }
  }
  const  result = await prismaClient.Credit.findMany(filter)
  return result
}

export async function getCreditById(id): Promise<Credit> {
  const  result = await prismaClient.Credit.findUnique({ where: { id } })
  return result
}

export async function newCredit(data): Promise<Credit> {
  const  result = await prismaClient.Credit.create({ data })
  return result
}

