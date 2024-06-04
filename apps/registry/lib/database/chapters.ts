import prismaClient from "prisma/client"
import { Chapter } from "prisma/models"

export async function getChapters(query): Promise<Chapter | Array<Chapter>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  //let include = {}

  if (query?.orgid) {
    where = { orgid: query.orgid }
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
  const  result = await prismaClient.Chapter.findMany(filter)
  return result
}

export async function getChapterById(id): Promise<Chapter> {
  const  result = await prismaClient.Chapter.findUnique({ where: { id } })
  return result
}

export async function newChapter(data): Promise<Chapter> {
  const  result = await prismaClient.Chapter.create({ data })
  return result
}

