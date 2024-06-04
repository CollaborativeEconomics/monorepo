import prismaClient from "prisma/client"
import { Cronjob } from "prisma/models"

export async function getCronjobs(query): Promise<Array<Cronjob>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = { created: 'desc' }
  //let include = {}

  if(query?.cron){
    where = { cron: query.cron }
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
  }
  const  result = await prismaClient.Cronjob.findMany(filter)
  return result
}

export async function newCronjob(data): Promise<Cronjob> {
  const  result = await prismaClient.Cronjob.create({ data })
  return result
}

