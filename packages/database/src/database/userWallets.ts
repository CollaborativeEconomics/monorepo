import type { ListQuery } from "@cfce/types"
import type { Chain, Prisma, UserWallet } from "@prisma/client"
import { prismaClient } from ".."

interface UserWalletQuery extends ListQuery {
  userId?: string
}
// @deprecated looks like
export async function getUserWallets(query: UserWalletQuery) {
  let where = {}
  const skip = 0
  const take = 100
  const orderBy = {}
  const include = {
    users: true,
  }

  if (query?.userId) {
    where = { userId: query.userId }
  }

  const filter = { where, skip, take, orderBy }
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
    filter.orderBy = { name: "asc" }
  }
  const data = await prismaClient.userWallet.findMany(filter)

  return data
}

// @deprecated looks like
export async function newUserWallet(data: Prisma.UserWalletCreateInput) {
  console.log("DATA", data)
  const result = await prismaClient.userWallet.create({ data })
  console.log("NEWUSERWALLET", result)
  return result
}

// @deprecated looks like
export async function getUserWalletById(id: string) {
  const result = await prismaClient.userWallet.findUnique({
    where: { id },
    include: { users: true },
  })
  return result
}

// @deprecated looks like
export async function getUserWalletByAddress(address: string, chain: Chain) {
  const result = await prismaClient.userWallet.findFirst({
    where: {
      chain,
      address: {
        equals: address,
        mode: "insensitive",
      },
    },
    include: {
      users: true,
    },
  })
  return result
}

// Maybe someday, but for now this raises too many edge cases
// export async function deleteUserWallet(id: string) {
//   await prismaClient.userWallet.delete({
//     where: { id },
//   })
// }
