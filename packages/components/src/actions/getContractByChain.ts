"use server"
import "server-only"
import { type Prisma, type Contract, getContracts } from "@cfce/database"

export default async function getContractByChain(
  entity_id: string,
  contract_type: string,
  chain: string,
  network: string
) {
  try {
    const list = await getContracts({entity_id, contract_type, chain, network})
    if(list && Array.isArray(list) && list.length > 0){
      const plain = JSON.parse(JSON.stringify(list[0])) // first result
      return plain
    }
    return null
  } catch (error) {
    console.log("DB ERROR", error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
