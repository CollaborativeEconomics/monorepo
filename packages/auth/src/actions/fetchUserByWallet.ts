"use server"
import { type User, getUserByWallet } from "@cfce/database"

export default async function fetchUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  try {
    return await getUserByWallet(walletAddress)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
