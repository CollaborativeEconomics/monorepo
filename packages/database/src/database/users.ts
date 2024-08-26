import type { Prisma, User } from "@prisma/client"
import { prismaClient } from ".."

interface UserQuery {
  email?: string
  name?: string
  wallet?: string
  apikey?: string
}

export async function getUsers(query: UserQuery) {
  console.log("QUERY", query)
  const include = {
    artworks: {
      include: { author: true },
    },
    collections: true,
    wallets: true,
  }

  if (query?.email) {
    return getUserByEmail(query.email)
  }

  if (query?.wallet) {
    return getUserByWallet(query.wallet)
  }

  if (query?.apikey) {
    return getUserByApiKey(query.apikey)
  }

  // TODO: we maybe shouldn't return all users?
  return prismaClient.user.findMany({ include })
}

export async function getUserByApiKey(apiKey: string) {
  const user = await prismaClient.user.findFirst({
    where: {
      api_key: apiKey,
    },
  })
  return user
}

export async function getUserByWallet(walletAddress: string) {
  const user = await prismaClient.user.findFirst({
    include: {
      wallets: true,
    },
    where: {
      wallets: {
        some: {
          address: walletAddress,
        },
      },
    },
  })
  return user
}

export async function newUser(data: Prisma.UserCreateArgs["data"]) {
  const user = await prismaClient.user.create({ data })
  console.log("NEW", user)
  return user
}

export async function setUser(id: string, data: Partial<User>) {
  const user = await prismaClient.user.update({ where: { id }, data })
  console.log("SET", user)
  return user
}

export async function getUserById(id: string) {
  const include = {
    artworks: {
      include: { author: true },
    },
    collections: true,
    wallets: true,
  }
  const user = await prismaClient.user.findUnique({ where: { id }, include })
  console.log("GET", user)
  return user
}

export async function getUserByEmail(email: string) {
  const user = await prismaClient.user.findUnique({ where: { email } })
  return user
}
