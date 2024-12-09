import "server-only"
import { prismaClient } from ".."
import type { Prisma, Event } from "@prisma/client"
import type { ListQuery } from "@cfce/types"

interface EventQuery extends ListQuery {
  id?: string
  orgid?: string
  initid?: string
}

export async function getEvents(query:EventQuery) {
  let where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  const include = {}

  if (query?.id) {
    const result = await prismaClient.event.findUnique({ where: { id: query.id } })
    return result
  }

  if (query?.orgid) {
    where = { organizationid: query.orgid }
  }

  if (query?.initid) {
    where = { initiativeid: query.initid }
  }

  const filter = { where, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = Number.parseInt(query?.page || '0', 10)
    let size = Number.parseInt(query?.size || '100', 10)
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    const start = page * size
    filter.skip = start
    filter.take = size
    filter.orderBy = { name: 'asc' }
  }
  const data = await prismaClient.event.findMany(filter)
  return data
}

export async function getEventById(id:string) {
  const result = await prismaClient.event.findUnique({ where: { id } })
  return result;
}

export async function newEvent(data:Prisma.EventCreateInput) {
  //console.log('DATA', data)
  const result = await prismaClient.event.create({data})
  //console.log('NEWEVENT', result)
  return result
}

