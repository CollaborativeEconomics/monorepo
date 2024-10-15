import "server-only"
import { prismaClient } from ".."
import { Prisma, Volunteers } from "@prisma/client"
import type { ListQuery } from "@cfce/types"

interface VolunteerQuery extends ListQuery {
  id?: string
  eventid?: string
}

export async function getVolunteers(query:VolunteerQuery): Promise<Volunteers|Array<Volunteers>|null> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = {}
  let include = {}

  if (query?.id) {
    const result = await prismaClient.volunteers.findUnique({ where: { id: query.id } })
    return result
  }

  if (query?.eventid) {
    where = { eventid: query.eventid }
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
  let data = await prismaClient.volunteers.findMany(filter)

  return data
}

export async function getVolunteerById(id:string): Promise<Volunteers|null> {
  const result = await prismaClient.volunteers.findUnique({ where: { id } })
  return result;
}

export async function newVolunteer(data:Prisma.VolunteersCreateInput): Promise<Volunteers> {
  console.log('DATA', data)
  const result = await prismaClient.volunteers.create({data})
  console.log('NEW.VOLUNTEER', result)
  return result
}

