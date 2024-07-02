import { NFTData, Prisma } from "@prisma/client"
import { ListQuery } from "../types"
import { prismaClient } from "index"


interface NFTDataQuery extends ListQuery {
  id?: string
  orgid?: string
  userid?: string
  address?: string
  tokenid?: string
}

export async function getNftData(query: NFTDataQuery): Promise<NFTData | Array<NFTData>> {
  let data = null
  let filter: Prisma.NFTDataFindManyArgs = {
    skip: 0,
    take: 100,
    include: {
      organization: true,
      initiative: true,
      user: true
    },
    where: {}
  }

  if (query?.orgid) {
    filter.where = {
      organizationId: query.orgid
    }
  } else if (query?.userid) {
    filter.where = {
      userId: {
        equals: query.userid
      }
    }
  } else if (query?.address) {
    filter.where = {
      donorAddress: {
        equals: query.address,
        mode: 'insensitive'
      }
    }
  } else if (query?.tokenid) {
    filter.where = {
      tokenId: {
        equals: query.tokenid,
        mode: 'insensitive'
      }
    }
  }

  // filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query.page || '0')
    let size = parseInt(query.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    filter.orderBy = { created: query?.order || 'desc' } as Prisma.NFTDataOrderByWithRelationInput;
  }
  data = await prismaClient.nFTData.findMany(filter)

  return data
}

export async function newNftData(data: NFTData): Promise<NFTData> {
  let result = await prismaClient.nFTData.create({ data })
  return result
}

export async function getNFTbyTokenId(tokenId: string): Promise<NFTData | null> {
  const data = await prismaClient.nFTData.findUnique({ where: { tokenId } })
  return data;
}

export async function getNFTById(id: string): Promise<NFTData | null> {
  const data = await prismaClient.nFTData.findUnique({ where: { id } })
  return data;
}

export async function deleteAllNFTs() {
  const data = await prismaClient.nFTData.deleteMany({})
  return data;
}
