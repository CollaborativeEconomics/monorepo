import prismaClient from "prisma/client"
import { Organization } from "prisma/models"

export async function getOrganizations(query): Promise<Organization | Array<Organization>> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = { name: 'asc' }
  let include = {
    category: true,
    wallets: true,
    initiative: {
      include: { 
        credits: true
      }
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category:true
          }
        }
      }
    },
  }

  if (query?.featured) {
    const record = await getFeaturedOrganization()
    console.log('Featured', record.name)
    return record
  }

  if (query?.email) {
    const record = await getOrganizationByEmail(query.email)
    console.log('Org', record.email, record.name)
    return record
  }

  if (query?.chain) {
    where = {
      wallets: {
        some: {
          chain: query.chain
        }
      }
    }
  }

 if (query?.wallet) {
   where = {...where,
     wallets: {
       some: {
         address: {
           equals: query.wallet,
           mode: 'insensitive'
         }
       }
     }
   }
 }

  if(query?.search) {
    where = {...where,
      OR: [
        {
          name: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query.search,
            mode: 'insensitive'
          }
        }
      ]
    }
  }

  if (query?.category) {
    where = {...where, category: { slug: query.category } }
  }

  if(query?.location){
    where = {...where, country: {
      contains: query.location,
      mode: 'insensitive'
    }}
  }

  //where['inactive'] = false

  let filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || 0)
    let size = parseInt(query?.size || 100)
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
  }
  let data = await prismaClient.Organization.findMany(filter)

  return data
}

export async function getOrganizationById(id): Promise<Organization> {
  let include = {
    category: true,
    wallets: true,
    initiative: {
      include: { credits: true }
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category:true
          }
        }
      }
    }
  }
  const organization = await prismaClient.Organization.findUnique({ where: { id }, include })
  return organization;
}

export async function getOrganizationByEmail(email): Promise<Organization> {
  let include = {
    category: true,
    wallets: true,
    initiative: {
      include: { credits: true }
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category:true
          }
        }
      }
    }
  }
  const organization = await prismaClient.Organization.findUnique({ where: { email }, include })
  return organization;
}

export async function getFeaturedOrganization(): Promise<Organization> {
  let include = {
    category: true,
    wallets: true,
    initiative: {
      include: { credits: true }
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category:true
          }
        }
      }
    }
  }
  const organizations = await prismaClient.Organization.findMany({ where: { featured:true }, include })
  const organization = organizations ? organizations[0] : null
  return organization
}

export async function newOrganization(data): Promise<Organization> {
  let result = await prismaClient.Organization.create({ data })
  return result
}

