"use server"
import { type Chain, type User, getUserByWallet, newUser } from "@cfce/database"
// import { auth } from "@cfce/auth"
// async function authenticate() {
//   const session = await auth()
//   if (!session) {
//     throw new Error("Unauthorized")
//   }
//   return session
// }

export async function fetchUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  // await authenticate()
  return await getUserByWallet(walletAddress)
}

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
    const tba = await newTokenBoundAccount(EntityType.user, user.id)
    console.log("TBA created", tba)
  }
  return user
}
