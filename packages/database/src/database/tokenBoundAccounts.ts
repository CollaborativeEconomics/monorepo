import "server-only"
import { prismaClient } from ".."
import { Prisma, TokenBoundAccount } from "@prisma/client"
import type { ListQuery } from "@cfce/types"

interface TBAQuery extends ListQuery {
  id?: string
}

export async function getAccount(entity_type:string, entity_id:string, chain:string, network:string): Promise<TokenBoundAccount|null> {
  const where = {
    entity_type,
    entity_id,
    chain,
    network
  }
  const data = await prismaClient.tokenBoundAccount.findMany({where})
  if(data && data?.length > 0){
    return data[0]
  }
  return null
}

export async function getAccounts(query:TBAQuery): Promise<TokenBoundAccount|Array<TokenBoundAccount>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  let include = {}
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
    //filter.orderBy = {}
  }
  let data = await prismaClient.tokenBoundAccount.findMany(filter)
  return data
}

export async function newAccount(data:Prisma.TokenBoundAccountCreateInput): Promise<TokenBoundAccount> {
  let result = await prismaClient.tokenBoundAccount.create({data})
  return result
}
