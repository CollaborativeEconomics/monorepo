"use server"
import { type Chain, type User, getUserByWallet, newUser } from "@cfce/database"
import { getServerSession } from "next-auth/next"
import { getSession } from "next-auth/react"
import { authOptions } from "../auth/nextAuth"

// async function authenticate() {
//   const session = await getServerSession(authOptions)
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

export async function createNewUser(
  walletAddress: string,
  chain: Chain,
): Promise<User> {
  // await authenticate()
  return await newUser({
    name: "Anonymous",
    wallet: walletAddress,
    wallets: {
      create: {
        address: walletAddress,
        chain,
      },
    },
  })
}
