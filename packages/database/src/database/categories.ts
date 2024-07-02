import { Category, Prisma } from "@prisma/client"
import { prismaClient } from "index"
import { ListQuery } from "../types"

interface CategoryQuery extends ListQuery {
  distinct?: string
}

export async function getCategories(query: CategoryQuery): Promise<Array<Category>> {
  let filter: Prisma.CategoryFindManyArgs = { skip: 0, take: 100 }
  if (query?.distinct) {
    if (query.distinct === 'organizations')
      filter.where = {
        organizations: {
          some: {},
        },
      }
  }
  if (query.distinct === 'initiatives') {
    filter.where = {
      initiatives: {
        some: {},
      },
    }
  }
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
  console.log({ filter });

  let data = await prismaClient.category.findMany(filter)
  return data
}