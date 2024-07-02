import prismaClient from "prisma/client"
import { UserWallet } from "prisma/models"

export async function getUserWallets(query): Promise<UserWallet|Array<UserWallet>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  let include = {
    users: true
  }

  if (query?.userid) {
    where = { userId: query.userid }
  }

  let filter = { where, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || 0)
    let size = parseInt(query?.size || 100)
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    filter.orderBy = { name: 'asc' }
  }
  let data = await prismaClient.UserWallet.findMany(filter)

  return data
}

export async function newUserWallet(data): Promise<UserWallet> {
  console.log('DATA', data)
  const result = await prismaClient.UserWallet.create({data})
  console.log('NEWUSERWALLET', result)
  return result
}

export async function getUserWalletById(id): Promise<UserWallet> {
  const result = await prismaClient.UserWallet.findUnique({ where: { id }, include: { users: true } })
  return result;
}

export async function getUserWalletByAddress(address, chain): Promise<UserWallet> {
  const result = await prismaClient.UserWallet.findFirst({ 
    where: { 
      chain, 
      address: { 
        equals: address, 
        mode: 'insensitive'
      }
    }, 
    include: { 
      users: true
    } 
  })
  return result;
}

