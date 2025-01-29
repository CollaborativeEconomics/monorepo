"use server"
import {
  type Chain,
  type Prisma,
  type User,
  newUser,
} from "@cfce/database"
import { EntityType } from "@cfce/types"
import { newTBAccount } from "@cfce/tbas"

export async function createNewUser(
  userData: Prisma.UserCreateInput,
  tba = false,
): Promise<User> {
  try {
    const user = await newUser(userData)
    if (tba) {
      console.log("TBA will be created for user ", user)
      const tba = await newTBAccount(EntityType.user, user.id) // in TBAs package
      console.log("TBA created", tba)
    }
    return user
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}

export async function createAnonymousUser({
  walletAddress,
  chain,
  network,
  tba = false,
}: {
  walletAddress: string
  chain: Chain
  network: string
  tba?: boolean
}): Promise<User> {
  return createNewUser(
    {
      name: "Anonymous",
      wallet: walletAddress,
      wallets: {
        create: {
          address: walletAddress,
          chain,
          network,
        },
      },
    },
    tba,
  )
}
