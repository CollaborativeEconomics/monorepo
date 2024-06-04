import prismaClient from "prisma/client"
import { Donation } from "prisma/models"

export async function getDonations(query): Promise<Donation | Array<Donation>> {
  let data    = null
  let where   = {}
  let skip    = 0
  let take    = 100
  let orderBy = {created:'desc'}
  let unique  = false
  let filter  = null
  let include = {
    organization: true,
    initiative: true
  }

  if(query?.favs){
    const userid = query.favs
    filter = {
      distinct: ['organizationId'],
      select: {
        organization: true,
      },
      where: {
        userId: userid
      }
    }
    data = await prismaClient.Donation.findMany(filter)
    return data
  }

  if(query?.badges){
    const userid = query.badges
    filter = {
      distinct: ['categoryId'],
      select: {
        category: true,
      },
      where: {
        userId: userid
      }
    }
    data = await prismaClient.Donation.findMany(filter)
    return data
  }

  if(query?.id){
    unique = true
    where['id'] = query.id
  }

  if(query?.orgid) {
    where['organizationId'] = query.orgid
  } 

  if(query?.chapterid) {
    where['chapterId'] = query.chapterid
  }

  if(query?.initid) {
    where['initiativeId'] = query.initid
  }

  if(query?.userid) {
    where['userId'] = query.userid
  } 

  if(query?.wallet) {
    where['wallet'] = {
      equals: query.wallet,
      mode: 'insensitive'
    }
  } 

  if(query?.from && query?.to) {
    where['created'] = {
      gte: new Date(query.from),   // .toISOString()
      lte: new Date(query.to)
    }
  }

/*
    where: {
      date: {
        lte: 2022-01-30,
        gte: 2022-01-15,
      },
    }
*/

  if(unique){
    filter = {where, include}
    data = await prismaClient.Donation.findUnique(filter)
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
    }
    data = await prismaClient.Donation.findMany(filter)
  }

  return data
}


export async function newDonation(data): Promise<Donation> {
  let rec = await prismaClient.Donation.create({ data })
  console.log('NEW DONATION', rec)
  return rec
}

