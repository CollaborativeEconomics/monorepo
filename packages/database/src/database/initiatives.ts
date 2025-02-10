import "server-only"
import type { ListQuery } from "@cfce/types"
import type { Initiative, Prisma } from "@prisma/client"
import { prismaClient } from ".."

interface InitiativeQuery extends ListQuery {
  orgId?: string
  category?: string
  location?: string
  search?: string
}

export async function getInitiatives(query: InitiativeQuery) {
  let where: Prisma.InitiativeWhereInput = {}
  let skip: Prisma.InitiativeFindManyArgs["skip"] = 0
  let take: Prisma.InitiativeFindManyArgs["take"] = 100
  const include: Prisma.InitiativeInclude = {
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
      orderBy: {
        created: "desc",
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
    skip = start
    take = size
  }
  return prismaClient.initiative.findMany({
    where,
    include,
    skip,
    take,
    orderBy: { title: "asc" },
  })
}

const initiativeDeepInclude = {
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

export type InitiativeWithRelations = Prisma.InitiativeGetPayload<{
  include: typeof initiativeDeepInclude
}>

export async function getInitiativeById(
  id: string,
): Promise<InitiativeWithRelations | null> {
  const result = await prismaClient.initiative.findUnique({
    where: { id },
    include: initiativeDeepInclude,
  })
  return result
}

export async function getInitiativeByTag(tag: number) {
  const result = await prismaClient.initiative.findUnique({
    where: { tag },
    include: initiativeDeepInclude,
  })
  return result
}

export async function newInitiative(data: Prisma.InitiativeCreateInput) {
  const result = await prismaClient.initiative.create({ data })
  return result
}

export async function updateInitiative(
  id: string,
  data: Prisma.InitiativeUpdateInput,
) {
  const result = await prismaClient.initiative.update({ where: { id }, data })
  return result
}

export async function deleteInitiative(id: string) {
  const result = await prismaClient.initiative.delete({ where: { id } })
  return result
}
