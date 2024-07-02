import { Cronjob, Prisma } from "@prisma/client"
import { ListQuery } from "../types"
import { prismaClient } from "index"

interface CronjobQuery extends ListQuery {
  cron?: string
}

export async function getCronjobs(query: CronjobQuery): Promise<Array<Cronjob>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy: Prisma.CronjobOrderByWithRelationInput = { created: 'desc' }
  //let include = {}

  if(query?.cron){
    where = { cron: query.cron }
  }

  let filter: Prisma.CronjobFindManyArgs = { where, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
  }
  const  result = await prismaClient.cronjob.findMany(filter)
  return result
}

export async function newCronjob(data: Cronjob): Promise<Cronjob> {
  // @ts-ignore Not sure why it doesn't like the data.json type, since it comes from the same place as the Cronjob type
  const  result = await prismaClient.cronjob.create({ data })
  return result
}

