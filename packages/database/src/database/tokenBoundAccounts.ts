import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Prisma, TokenBoundAccount } from "@prisma/client"
import { prismaClient } from ".."

interface TBAQuery extends ListQuery {
  id?: string
}

export async function getTokenBoundAccount(
  entity_type: string,
  entity_id: string,
  chain: string,
  network: string,
): Promise<TokenBoundAccount | null> {
  const where = {
    entity_type,
    entity_id,
    chain,
    network,
  }
  console.log("TBA REC WHERE", where)
  const data = await prismaClient.tokenBoundAccount.findFirst({ where })
  console.log("TBA REC DATA", data)
  return data
}

export async function getTokenBoundAccounts(query: TBAQuery) {
  const where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  const include = {}
  const filter = { where, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = Number.parseInt(query?.page || "0", 10)
    let size = Number.parseInt(query?.size || "100", 10)
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
    //filter.orderBy = {}
  }
  const data = await prismaClient.tokenBoundAccount.findMany(filter)
  return data
}

export async function newTokenBoundAccount(
  data: Prisma.TokenBoundAccountCreateInput,
) {
  const result = await prismaClient.tokenBoundAccount.create({ data })
  return result
}
