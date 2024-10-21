import "server-only"
import { prismaClient } from ".."
import type { Prisma, Contract } from "@prisma/client"
import type { ListQuery } from "@cfce/types"

interface ContractQuery extends ListQuery {
  id?: string
  entity_id?: string
  chain?: string
  network?: string
  contract_type?: string
}

export async function getContracts(query:ContractQuery) {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  //let include = {}

  if (query?.id) {
    const result = await prismaClient.contract.findUnique({ where: { id: query.id } })
    return result
  }

  if (query?.entity_id && query?.chain && query?.network && query?.contract_type) {
    const result = await getContract(query.entity_id, query.chain, query.network, query.contract_type)
    return result
  }

  let filter = { where, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    const start = page * size
    filter.skip = start
    filter.take = size
    //filter.orderBy = { name: 'asc' }
  }
  const  result = await prismaClient.contract.findMany(filter)
  return result
}

export async function getContractById(id:string) {
  const  result = await prismaClient.contract.findUnique({ where: { id } })
  return result
}

export async function getContract(entity_id:string, chain:string, network:string, contract_type:string) {
  const  result = await prismaClient.contract.findMany({ where: { entity_id, chain, network, contract_type } })
  return result
}

export async function newContract(data:Prisma.ContractCreateInput) {
  const  result = await prismaClient.contract.create({ data })
  return result
}

export async function updateContract(id:string, data:Prisma.ContractUpdateInput) {
  const  result = await prismaClient.contract.update({ where: { id }, data })
  return result
}
