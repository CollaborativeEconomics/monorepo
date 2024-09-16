import "server-only"
import type { Collection } from "@prisma/client"
import { prismaClient } from "../index"
import type { ListQuery } from "../types"

interface CollectionQuery extends ListQuery {
  userId?: string
}

export async function getCollections(
  query: CollectionQuery,
): Promise<Collection | Array<Collection>> {
  let where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  const include = {
    author: true,
  }

  if (query?.userId) {
    where = { authorId: query.userId }
  }

  const filter = { where, include, skip, take, orderBy }
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
    filter.orderBy = { created: query?.order || "desc" }
  }
  const data = await prismaClient.collection.findMany(filter)

  return data
}

export async function newCollection(data: Collection): Promise<Collection> {
  const result = await prismaClient.collection.create({ data })
  return result
}

export async function getCollectionById(
  id: string,
): Promise<Collection | null> {
  const result = await prismaClient.collection.findUnique({
    where: { id },
    include: {
      author: true,
      artworks: true,
    },
  })
  return result
}
