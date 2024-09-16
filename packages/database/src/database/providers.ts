import "server-only"
import type { Provider } from "@prisma/client"
import type { ListQuery } from "types"
import { prismaClient } from ".."

interface ProviderQuery extends ListQuery {
  category?: string
  chain?: string
  wallet?: string
  email?: string
  search?: string
  location?: string
  featured?: boolean
}

export async function getProviders(
  query: ProviderQuery,
): Promise<Array<Provider>> {
  const where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  //let include = {}

  //if (query?.credits) {
  //  include = { credits: true }
  //}

  const filter = { where, skip, take, orderBy }
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
    //filter.orderBy = { name: 'asc' }
  }
  const result = await prismaClient.provider.findMany(filter)
  return result
}

export async function getProviderById(id: string): Promise<Provider | null> {
  const result = await prismaClient.provider.findUnique({ where: { id } })
  return result
}

export async function newProvider(data: Provider): Promise<Provider> {
  const result = await prismaClient.provider.create({ data })
  return result
}
