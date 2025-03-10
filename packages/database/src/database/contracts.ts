import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Contract, Prisma } from "@prisma/client"
import { prismaClient } from ".."

interface ContractQuery extends ListQuery {
  entity_id?: string
  chain?: string
  network?: string
  contract_type?: string
}

const DEFAULT_PAGE_SIZE = 100
const MAX_PAGE_SIZE = 200

export async function getContracts(query: ContractQuery) {
  // Build where clause from query parameters
  const where: Prisma.ContractWhereInput = {
    ...(query?.entity_id && { entity_id: query.entity_id }),
    ...(query?.chain && { chain: query.chain }),
    ...(query?.network && { network: query.network }),
    ...(query?.contract_type && { contract_type: query.contract_type }),
  }

  // Handle pagination
  const page = Math.max(0, Number(query?.page) || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(query?.size) || DEFAULT_PAGE_SIZE),
  )

  const filter: Prisma.ContractFindManyArgs = {
    where,
    skip: page * size,
    take: size,
  }

  console.log("getContracts FILTER", filter)

  return prismaClient.contract.findMany(filter)
}

export async function getContractById(id: string) {
  const result = await prismaClient.contract.findUnique({ where: { id } })
  return result
}

export async function getContract(
  entity_id: string,
  chain: string,
  network: string,
  contract_type: string,
) {
  const result = await prismaClient.contract.findMany({
    where: { entity_id, chain, network, contract_type },
  })
  return result
}

export async function getContractsByChain(chain: string, network: string) {
  const result = await prismaClient.contract.findMany({
    where: { chain, network },
  })
  return result
}

export async function newContract(
  data: Prisma.ContractCreateInput,
): Promise<Contract> {
  return prismaClient.contract.create({ data })
}

export async function updateContract(
  id: string,
  data: Prisma.ContractUpdateInput,
): Promise<Contract> {
  return prismaClient.contract.update({ where: { id }, data })
}
