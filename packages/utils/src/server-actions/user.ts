"use server"
import { type User, getUserByWallet, newUser } from "@cfce/database"
import { getSession } from "next-auth/react"

async function authenticate() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function fetchUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  await authenticate()
  return await getUserByWallet(walletAddress)
}

export async function createNewUser(walletAddress: string): Promise<User> {
  await authenticate()
  return await newUser({
    name: "Anonymous",
    wallet: walletAddress,
    wallets: {
      create: {
        address: walletAddress,
        chain: "chainName", // Replace with actual chain name
      },
    },
  })
}
