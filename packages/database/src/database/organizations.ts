import { Organization, Prisma } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "types"

interface OrganizationQuery extends ListQuery {
  category?: string
  chain?: string
  wallet?: string
  email?: string
  search?: string
  location?: string
  featured?: boolean
}

export async function getOrganizations(query: OrganizationQuery): Promise<Organization | Array<Organization> | null> {
  let where = {}
  let skip = 0
  let take = 100
  let orderBy = { name: 'asc' } as Prisma.OrganizationOrderByWithRelationInput
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
            category: true
          }
        }
      }
    },
  }

  if (query?.featured) {
    const record = await getFeaturedOrganization()
    console.log('Featured', record?.name)
    return record
  }

  if (query?.email) {
    const record = await getOrganizationByEmail(query.email)
    console.log('Org', record?.email, record?.name)
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
    where = {
      ...where,
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

  if (query?.search) {
    where = {
      ...where,
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
    where = { ...where, category: { slug: query.category } }
  }

  if (query?.location) {
    where = {
      ...where, country: {
        contains: query.location,
        mode: 'insensitive'
      }
    }
  }

  //where['inactive'] = false

  let filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
  }
  let data = await prismaClient.organization.findMany(filter)

  return data
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
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
            category: true
          }
        }
      }
    }
  }
  const organization = await prismaClient.organization.findUnique({ where: { id }, include })
  return organization;
}

export async function getOrganizationByEmail(email: string): Promise<Organization | null> {
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
            category: true
          }
        }
      }
    }
  }
  const organization = await prismaClient.organization.findUnique({ where: { email }, include })
  return organization;
}

export async function getFeaturedOrganization(): Promise<Organization | null> {
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
            category: true
          }
        }
      }
    }
  }
  const organizations = await prismaClient.organization.findMany({ where: { featured: true }, include })
  const organization = organizations.length ? organizations[0] as Organization : null
  return organization
}

export async function newOrganization(data: Organization): Promise<Organization> {
  let result = await prismaClient.organization.create({ data })
  return result
}

