import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Chain, Prisma, Wallet } from "@prisma/client"
import { prismaClient } from ".."

interface WalletQuery extends ListQuery {
  address?: string
  orgId?: string
  initiativeId?: string
  chain?: Chain
}

export async function getWallets(query: WalletQuery) {
  const where: Prisma.WalletWhereInput = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  const include = {
    //organizations: true
    initiatives: {
      select: {
        title: true
      }
    }
  }

  const filter = { where, include, skip, take, orderBy }
  if (query?.orgId) {
    where.organizationId = query.orgId
  }
  if (query?.initiativeId) {
    where.initiativeId = query.initiativeId
  }
  if (query?.chain) {
    where.chain = query.chain
  }
  if (query?.page || query?.size) {
    let page = Number.parseInt(query?.page || "0")
    let size = Number.parseInt(query?.size || "100")
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
    filter.orderBy = { name: "asc" }
  }
  const data = await prismaClient.wallet.findMany(filter)
  return data
}

export async function newWallet(
  data: Prisma.WalletCreateInput,
): Promise<Wallet> {
  console.log('NEW DATA', data)
  const result = await prismaClient.wallet.create({ data })
  console.log('RES DATA', result)
  return result
}
