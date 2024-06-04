import prismaClient from "prisma/client"
import { NFTData } from "prisma/models"

export async function getNftData(query): Promise<NFTData | Array<NFTData>> {
  let data    = null
  let where   = {}
  let skip    = 0
  let take    = 100
  let orderBy = {}
  let unique  = false
  let filter  = null
  let include = {
    organization:true, 
    initiative:true,
    user:true
  }

  if(query?.id){
    unique = true
    where = {
      id: query.id
    }
  } else if(query?.orgid) {
    where = {
      organizationId: query.orgid
    }
  } else if(query?.userid) {
    where = {
      userId: {
        equals: query.userid
      }
    }
  } else if(query?.address) {
    where = {
      donorAddress: {
        equals: query.address,
        mode: 'insensitive'
      }
    }
  } else if(query?.tokenid){
    //unique = true
    where = {
      tokenId: {
        equals: query.tokenid,
        mode: 'insensitive'
      }
    }
  }

  if(unique){
    filter = {where, include}
    data = await prismaClient.NFTData.findUnique(filter)
  } else {
    filter = {where, include, skip, take, orderBy}
    if(query?.page || query?.size){
      let page = parseInt(query.page || 0)
      let size = parseInt(query.size || 100)
      if(page<0){ page = 0 }
      if(size<0){ size = 100 }
      if(size>200){ size = 200 }
      let start = page * size
      filter.skip = start
      filter.take = size
      filter.orderBy = {created:query?.order||'desc'}
    }
    data = await prismaClient.NFTData.findMany(filter)
  }

  return data
}

export async function newNftData(data): Promise<NFTData> {
  let result = await prismaClient.NFTData.create({data})
  return result
}

export async function getNFTbyTokenId(tokenId): Promise<NFTData> {
  const data = await prismaClient.NFTData.findUnique({ where: { tokenId } })
  return data;
}

export async function deleteAllNFTs() {
  const data = await prismaClient.NFTData.deleteMany({})
  return data;
}
