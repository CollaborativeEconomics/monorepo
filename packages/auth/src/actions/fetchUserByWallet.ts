"use server"
import { type User, getUserByWallet } from "@cfce/database"

export default async function fetchUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  // await authenticate()
  return await getUserByWallet(walletAddress)
}
