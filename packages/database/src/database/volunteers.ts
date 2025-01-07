import "server-only"
import { prismaClient } from ".."
import type { Prisma, Volunteer } from "@prisma/client"
import type { ListQuery } from "@cfce/types"

interface VolunteerQuery extends ListQuery {
  id?: string
  eventid?: string
}

export async function getVolunteers(query:VolunteerQuery) {
  let where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  const include = {}

  if (query?.id) {
    const result = await prismaClient.volunteer.findUnique({ where: { id: query.id } })
    return result
  }

  if (query?.eventid) {
    where = { eventid: query.eventid }
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
  const data = await prismaClient.volunteer.findMany(filter)
  return data
}

export async function getVolunteerById(id:string) {
  const result = await prismaClient.volunteer.findUnique({ where: { id } })
  return result;
}

export async function newVolunteer(data:Prisma.VolunteerCreateInput) {
  console.log('DATA', data)
  const result = await prismaClient.volunteer.create({data})
  console.log('NEW.VOLUNTEER', result)
  return result
}

