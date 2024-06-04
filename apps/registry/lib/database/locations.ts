import prismaClient from "prisma/client"
import { Organization } from "prisma/models"

type Dictionary = { [key:string]:any }

export async function getLocations(): Promise<Array<Dictionary>> {
  const data = await prismaClient.Organization.findMany({
    distinct: ['country'],
    select: {
      country: true,
    },  
    orderBy: { country: 'asc' }
  })
  const list = data.map(it=>{ return it.country || '[All World]' })
  return list
}