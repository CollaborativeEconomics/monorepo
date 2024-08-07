import { Chain, Prisma, UserWallet } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "types"

interface UserWalletQuery extends ListQuery {
  userid?: string
}
// @deprecated looks like
export async function getUserWallets(query: UserWalletQuery): Promise<UserWallet | Array<UserWallet>> {
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
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    filter.orderBy = { name: 'asc' }
  }
  let data = await prismaClient.userWallet.findMany(filter)

  return data
}

// @deprecated looks like
export async function newUserWallet(data: Omit<UserWallet, 'id'>): Promise<UserWallet> {
  console.log('DATA', data)
  const result = await prismaClient.userWallet.create({ data })
  console.log('NEWUSERWALLET', result)
  return result
}

// @deprecated looks like
export async function getUserWalletById(id: string): Promise<UserWallet | null> {
  const result = await prismaClient.userWallet.findUnique({ where: { id }, include: { users: true } })
  return result;
}

// @deprecated looks like
export async function getUserWalletByAddress(address: string, chain: Chain): Promise<UserWallet | null> {
  const result = await prismaClient.userWallet.findFirst({
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

