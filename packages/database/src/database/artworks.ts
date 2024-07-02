import { Artwork } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "../types"

interface ArtworkQuery extends ListQuery {
  userid?: string
  collectionid?: string
  type?: string
}

export async function getArtworks(query: ArtworkQuery): Promise<Artwork | Array<Artwork>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  let include = {
    author: true,
    collection: true,
    beneficiary: true
  }

  if (query?.userid) {
    where = { authorId: query.userid }
  } else if (query?.collectionid) {
    where = { collectionId: query.collectionid }
  } else if (query?.type) {
    const curated = (query.type == 'curated' ? true : false)
    where = { collection: { curated } }
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
  let data = await prismaClient.artwork.findMany(filter)

  return data
}

export async function newArtwork(data: Artwork): Promise<Artwork | null> {
  let result = await prismaClient.artwork.create({ data })
  return result
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const data = await prismaClient.artwork.findUnique({ where: { id }, include: { author: true, collection: true, beneficiary: true } })
  return data
}

export async function getArtworkByTokenId(tokenId: string): Promise<Artwork | null> {
  const data = await prismaClient.artwork.findFirst({
    where: { tokenId },
    include: {
      author: true,
      collection: true,
      beneficiary: true
    }
  })
  return data
}
