import prismaClient from "prisma/client"
import { Artwork } from "prisma/models"

export async function getArtworks(query): Promise<Artwork | Array<Artwork>> {
  let where   = {}
  let skip    = 0
  let take    = 100
  let orderBy = {}
  let include = {
    author:true, 
    collection:true, 
    beneficiary:true
  }

  if(query?.userid) {
    where = {authorId: query.userid}
  } else if(query?.collectionid) {
    where = {collectionId: query.collectionid}
  } else if(query?.type) {
    const curated = (query.type=='curated'?true:false)
    where = { collection: { curated } }
  }

  let filter = {where, include, skip, take, orderBy}
  if(query?.page || query?.size){
    let page = parseInt(query?.page || 0)
    let size = parseInt(query?.size || 100)
    if(page<0){ page = 0 }
    if(size<0){ size = 100 }
    if(size>200){ size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    filter.orderBy = {created:query?.order||'desc'}
  }
  let data = await prismaClient.Artwork.findMany(filter)

  return data
}

export async function newArtwork(data): Promise<Artwork> {
  let result = await prismaClient.Artwork.create({data})
  return result
}

export async function getArtworkById(id): Promise<Artwork> {
  const data = await prismaClient.Artwork.findUnique({ where: { id }, include: { author:true, collection:true, beneficiary:true } })
  return data
}

export async function getArtworkByTokenId(tokenId): Promise<Artwork> {
  const data = await prismaClient.Artwork.findUnique({ where: { tokenId }, include: { author:true, collection:true, beneficiary:true } })
  return data
}
