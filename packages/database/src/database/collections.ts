import { Collection } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "../types"

interface CollectionQuery extends ListQuery {
  userid?: string
}

export async function getCollections(query: CollectionQuery): Promise<Collection | Array<Collection>> {
  let where   = {}
  let skip    = 0
  let take    = 100
  let orderBy = {}
  let include = {
    author:true
  }

  if(query?.userid) {
    where = {authorId: query.userid}
  }

  let filter = {where, include, skip, take, orderBy}
  if(query?.page || query?.size){
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if(page<0){ page = 0 }
    if(size<0){ size = 100 }
    if(size>200){ size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    filter.orderBy = {created:query?.order||'desc'}
  }
  let data = await prismaClient.collection.findMany(filter)

  return data
}

export async function newCollection(data: Collection): Promise<Collection> {
  let result = await prismaClient.collection.create({data})
  return result
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  let result = await prismaClient.collection.findUnique({
    where: {id},
    include:{
      author: true,
      artworks: true
    }
  })
  return result
}