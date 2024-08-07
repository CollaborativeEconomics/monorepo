import { Chapter } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "../types"

interface ChapterQuery extends ListQuery {
  orgid?: string
}

export async function getChapters(query: ChapterQuery): Promise<Chapter | Array<Chapter>> {
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
  const result = await prismaClient.chapter.findMany(filter)
  return result
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  const result = await prismaClient.chapter.findUnique({ where: { id } })
  return result
}

export async function newChapter(data: Chapter): Promise<Chapter> {
  const result = await prismaClient.chapter.create({ data })
  return result
}

