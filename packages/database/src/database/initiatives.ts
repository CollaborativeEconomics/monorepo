import type { Initiative, Prisma } from "@prisma/client"
import { prismaClient } from ".."
import type { ListQuery } from "../types"

interface InitiativeQuery extends ListQuery {
  orgId?: string
  category?: string
  location?: string
  search?: string
}

export async function getInitiatives(query: InitiativeQuery) {
  let where = {}
  const skip = 0
  const take = 100
  const include = {
    category: true,
    credits: true,
    organization: {
      include: {
        wallets: true,
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

  if (query?.orgId) {
    where = { organizationId: query.orgId }
  }

  if (query?.search) {
    where = {
      ...where,
      OR: [
        {
          title: {
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

  const filter: Prisma.InitiativeFindManyArgs = {
    where,
    include,
    skip,
    take,
    orderBy: { title: "asc" },
  }
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
  return prismaClient.initiative.findMany(filter)
}

export async function getInitiativeById(id: string) {
  const include = {
    category: true,
    credits: true,
    organization: {
      include: {
        wallets: true,
      },
    },
    wallets: true,
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
  const result = await prismaClient.initiative.findUnique({
    where: { id },
    include,
  })
  return result
}

export async function getInitiativeByTag(tag: number) {
  const include = {
    category: true,
    credits: true,
    organization: {
      include: {
        wallets: true,
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
  const result = await prismaClient.initiative.findUnique({
    where: { tag },
    include,
  })
  return result
}

export async function newInitiative(data: Initiative) {
  const result = await prismaClient.initiative.create({ data })
  return result
}
