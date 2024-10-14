import "server-only"
import { prismaClient } from ".."
import { Prisma, Events } from "@prisma/client"
import type { ListQuery } from "@cfce/types"

interface EventQuery extends ListQuery {
  id?: string
  orgid?: string
  initid?: string
}

export async function getEvents(query:EventQuery): Promise<Events|Array<Events>|null> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  let include = {}

  if (query?.id) {
    const result = await prismaClient.events.findUnique({ where: { id: query.id } })
    return result
  }

  if (query?.orgid) {
    where = { organizationid: query.orgid }
  }

  if (query?.initid) {
    where = { initiativeid: query.initid }
  }

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
    filter.orderBy = { name: 'asc' }
  }
  let data = await prismaClient.events.findMany(filter)

  return data
}

export async function getEventById(id:string): Promise<Events|null> {
  const result = await prismaClient.events.findUnique({ where: { id } })
  return result;
}

export async function newEvent(data:Prisma.EventsCreateInput): Promise<Events> {
  console.log('DATA', data)
  const result = await prismaClient.events.create({data})
  console.log('NEWEVENT', result)
  return result
}

