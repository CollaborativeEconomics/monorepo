import prismaClient from "prisma/client"
import { Offer } from "prisma/models"

export async function getOffers(query): Promise<Offer | Array<Offer>> {
  let where   = {}
  let skip    = 0
  let take    = 100
  let unique  = false
  let orderBy = {}
  let include = {
    collection:true, 
    artwork:{ 
      include: { author: true} 
    }, 
    seller: true, 
    buyer: true, 
    beneficiary: true
  }

  if(query?.id){
    where = {id: query.id}
    const rec = await prismaClient.Offer.findUnique({where, include})
    return rec
  } else if(query?.sellerid){
    where = {sellerId: query.sellerid}
  } else if(query?.buyerid){
    where = {buyerId: query.buyerid}
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
  let result = await prismaClient.Offer.findMany(filter)
  return result
}

export async function newOffer(data): Promise<Offer> {
  let result = await prismaClient.Offer.create({data})
  return result
}

export async function updateOffer(id, data): Promise<Offer> {
  let result = await prismaClient.Offer.update({ where: { id }, data })
  return result
}

