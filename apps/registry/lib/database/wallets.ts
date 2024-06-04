import prismaClient from "prisma/client"
import { Wallet } from "prisma/models"

export async function getWallets(query): Promise<Wallet|Array<Wallet>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  let include = {
    organizations: true
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
  let data = await prismaClient.Wallet.findMany(filter)

  return data
}

export async function newWallet(data): Promise<Wallet> {
  let result = await prismaClient.Wallet.create({data})
  return result
}
