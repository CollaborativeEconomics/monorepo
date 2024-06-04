import prismaClient from "prisma/client"
import { Provider } from "prisma/models"

export async function getProviders(query): Promise<Provider | Array<Provider>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  //let include = {}

  //if (query?.credits) {
  //  include = { credits: true }
  //}

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
    //filter.orderBy = { name: 'asc' }
  }
  const  result = await prismaClient.Provider.findMany(filter)
  return result
}

export async function getProviderById(id): Promise<Provider> {
  const  result = await prismaClient.Provider.findUnique({ where: { id } })
  return result
}

export async function newProvider(data): Promise<Provider> {
  const  result = await prismaClient.Provider.create({ data })
  return result
}

