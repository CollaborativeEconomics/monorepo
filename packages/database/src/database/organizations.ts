import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Chain, Organization, Prisma } from "@prisma/client"
import { prismaClient } from ".."

interface OrganizationQuery extends ListQuery {
  category?: string
  chain?: Chain
  wallet?: string
  email?: string
  search?: string
  location?: string
  featured?: boolean
}

export async function getOrganizations(
  query: OrganizationQuery,
): Promise<Array<
  Prisma.OrganizationGetPayload<{ include: { initiative: true } }>
> | null> {
  let where = {} as Prisma.OrganizationWhereInput
  const skip = 0
  const take = 100
  const orderBy = { name: "asc" } as Prisma.OrganizationOrderByWithRelationInput
  const include = {
    category: true,
    wallets: true,
    initiative: {
      include: {
        credits: true,
      },
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category: true,
          },
        },
      },
    },
  }

  if (query?.featured) {
    const record = await getFeaturedOrganization()
    console.log("Featured", record?.name)
    return record ? [record] : null
  }

  if (query?.email) {
    const record = await getOrganizationByEmail(query.email)
    console.log("Org", record?.email, record?.name)
    return record ? [record] : null
  }

  if (query?.chain) {
    where = {
      wallets: {
        some: {
          chain: query.chain,
        },
      },
    }
  }

  if (query?.wallet) {
    where = {
      ...where,
      wallets: {
        some: {
          address: {
            equals: query.wallet,
            mode: "insensitive",
          },
        },
      },
    }
  }

  if (query?.search) {
    where = {
      ...where,
      OR: [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    }
  }

  if (query?.category) {
    where = { ...where, category: { slug: query.category } }
  }

  if (query?.location) {
    where = {
      ...where,
      country: {
        contains: query.location,
        mode: "insensitive",
      },
    }
  }

  //where['inactive'] = false

  const filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = Number.parseInt(query?.page || "0")
    let size = Number.parseInt(query?.size || "100")
    if (page < 0) {
      page = 0
    }
    if (size < 0) {
      size = 100
    }
    if (size > 200) {
      size = 200
    }
    const start = page * size
    filter.skip = start
    filter.take = size
  }
  const data = await prismaClient.organization.findMany(filter)

  return data
}

export async function getOrganizationById(
  id: string,
): Promise<Prisma.OrganizationGetPayload<{
  include: {
    category: true
    wallets: true
    initiative: {
      include: { credits: true }
    }
    stories: {
      include: {
        media: true
        organization: true
        initiative: {
          include: {
            category: true
          }
        }
      }
    }
  }
}> | null> {
  const include = {
    category: true,
    wallets: true,
    initiative: {
      include: { credits: true },
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category: true,
          },
        },
      },
    },
  }
  const organization = await prismaClient.organization.findUnique({
    where: { id },
    include,
  })
  return organization
}

export async function getOrganizationByEmail(
  email: string,
): Promise<Prisma.OrganizationGetPayload<{
  include: { initiative: true }
}> | null> {
  const include = {
    category: true,
    wallets: true,
    initiative: {
      include: { credits: true },
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category: true,
          },
        },
      },
    },
  }
  const organization = await prismaClient.organization.findUnique({
    where: { email },
    include,
  })
  return organization
}

export async function getFeaturedOrganization(): Promise<Prisma.OrganizationGetPayload<{
  include: { initiative: true }
}> | null> {
  const include = {
    category: true,
    wallets: true,
    initiative: {
      include: { credits: true },
    },
    stories: {
      include: {
        media: true,
        organization: true,
        initiative: {
          include: {
            category: true,
          },
        },
      },
    },
  }
  const organizations = await prismaClient.organization.findMany({
    where: { featured: true },
    include,
  })
  const organization = organizations.length
    ? (organizations[0] as Prisma.OrganizationGetPayload<{
        include: { initiative: true }
      }>)
    : null
  return organization
}

export async function newOrganization(
  data: Prisma.OrganizationCreateInput,
): Promise<Organization> {
  const result = await prismaClient.organization.create({ data })
  return result
}

export async function updateOrganization(
  id: string,
  data: Prisma.OrganizationUpdateInput,
) {
  const result = await prismaClient.organization.update({ where: { id }, data })
  return result
}

export async function deleteOrganization(id: string) {
  const result = await prismaClient.organization.delete({ where: { id } })
  return result
}
