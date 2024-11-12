"use server"
import {
  type Chain,
  type User,
  newTokenBoundAccount,
  newUser,
} from "@cfce/database"
import { EntityType } from "@cfce/types"

export default async function createNewUser(
  walletAddress: string,
  chain: Chain,
  network: string,
  tba = false,
): Promise<User> {
  // await authenticate()
  const user = await newUser({
    name: "Anonymous",
    wallet: walletAddress,
    wallets: {
      create: {
        address: walletAddress,
        chain,
        network,
      },
    },
  })
  if (tba) {
    console.log("TBA will be created for user ", user)
    const tba = await newTokenBoundAccount({
      entity_type: EntityType.user,
      entity_id: user.id,
    })
    console.log("TBA created", tba)
  }
  return user
}
