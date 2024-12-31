"use server"
import "server-only"
import type { Prisma, Contract } from "@cfce/database"
import * as db from "@cfce/database"

export async function newContract(data:Prisma.ContractCreateInput): Promise<Contract> {
  try {
    const record = await db.newContract(data)
    //console.log('RESULT', record)
    return record
  } catch (error) {
    console.log('ERROR', error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

export async function getOrganizationById(id:string) {
  try {
    const result = await db.getOrganizationById(id)
    //console.log('RESULT', result)
    return result
  } catch (error) {
    console.log('ERROR', error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

export async function getOrganizations() {
  try {
    const result = await db.getOrganizations({}) // All orgs
    //console.log('RESULT', result)
    return result
  } catch (error) {
    console.log('ERROR', error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

interface ContractsQuery {
  chain?: string
  network?: string
  entity_id?: string
  contract_type?: string
}
export async function getContracts(query:ContractsQuery) {
  try {
    const result = await db.getContracts(query)
    //console.log('RESULT', result)
    return result
  } catch (error) {
    console.log('ERROR', error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

export async function getEventsByOrganization(orgid: string) {
  try {
    const result = await db.getEvents({orgid})
    //console.log('RESULT', result)
    return result
  } catch (error) {
    console.log('ERROR', error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

