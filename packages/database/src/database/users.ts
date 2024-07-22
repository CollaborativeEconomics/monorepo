import type { User } from "@prisma/client"
import { prismaClient } from ".."

interface UserQuery {
  email?: string
  name?: string
  wallet?: string
  apikey?: string
}

export async function getUsers(
  query: UserQuery,
): Promise<User | Array<User> | null> {
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

export async function getUserByApiKey(apiKey: string): Promise<User | null> {
  const user = await prismaClient.user.findFirst({
    where: {
      api_key: apiKey,
    },
  })
  return user
}

export async function getUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  const user = await prismaClient.user.findFirst({
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

export async function newUser(data: User): Promise<User> {
  const user = await prismaClient.user.create({ data })
  console.log("NEW", user)
  return user
}

export async function setUser(id: string, data: User): Promise<User> {
  const user = await prismaClient.user.update({ where: { id }, data })
  console.log("SET", user)
  return user
}

export async function getUserById(id: string): Promise<User | null> {
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

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prismaClient.user.findUnique({ where: { email } })
  return user
}
