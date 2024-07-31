import type { NFTData, Prisma } from "@prisma/client"
import { prismaClient } from ".."
import type { ListQuery } from "../types"

interface NFTDataQuery extends ListQuery {
  id?: string
  orgId?: string
  userId?: string
  address?: string
  tokenid?: string
}

export async function getNftData(query: NFTDataQuery) {
  let data = null
  const filter: Prisma.NFTDataFindManyArgs = {
    skip: 0,
    take: 100,
    include: {
      organization: true,
      initiative: true,
      user: true,
    },
    where: {},
  }

  if (query?.orgId) {
    filter.where = {
      organizationId: query.orgId,
    }
  } else if (query?.userId) {
    filter.where = {
      userId: {
        equals: query.userId,
      },
    }
  } else if (query?.address) {
    filter.where = {
      donorAddress: {
        equals: query.address,
        mode: "insensitive",
      },
    }
  } else if (query?.tokenid) {
    filter.where = {
      tokenId: {
        equals: query.tokenid,
        mode: "insensitive",
      },
    }
  }

  // filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = Number.parseInt(query.page || "0")
    let size = Number.parseInt(query.size || "100")
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
    filter.orderBy = {
      created: query?.order || "desc",
    } as Prisma.NFTDataOrderByWithRelationInput
  }
  data = await prismaClient.nFTData.findMany(filter)

  return data
}

export async function newNftData(data: Prisma.NFTDataCreateInput) {
  const result = await prismaClient.nFTData.create({ data })
  return result
}

export async function getNFTbyTokenId(
  tokenId: string,
): Promise<NFTData | null> {
  const data = await prismaClient.nFTData.findUnique({ where: { tokenId } })
  return data
}

export async function getNFTById(id: string): Promise<NFTData | null> {
  const data = await prismaClient.nFTData.findUnique({ where: { id } })
  return data
}

export async function deleteAllNFTs() {
  const data = await prismaClient.nFTData.deleteMany({})
  return data
}
