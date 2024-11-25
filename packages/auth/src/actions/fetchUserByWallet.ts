"use server"
import { type User, getUserByWallet } from "@cfce/database"

export default async function fetchUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  try {
    const user = await getUserByWallet(walletAddress)
    //console.log('USER BY WALLET', user)
    return user
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
