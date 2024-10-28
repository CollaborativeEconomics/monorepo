"use server"
import { type Chain, type User, getUserByWallet, newUser } from "@cfce/database"
import { getServerSession } from "next-auth/next"
import { getSession } from "next-auth/react"
import { authOptions } from "../auth/nextAuth"
import { EntityType } from "@cfce/types"
import { newTokenBoundAccount } from "@cfce/tbas"

async function authenticate() {
  const session = await getServerSession(authOptions)
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

/*
interface UserType {
  created?: Date
  api_key?: string
  name?: string
  description?: string
  email?: string
  emailVerified?: boolean
  image?: string
  wallet?: string
  inactive?: boolean
}
*/

// TODO: pass data as user interface
export async function createNewUser(
  walletAddress: string,
  chain: Chain,
  network: string,
  tba = false
): Promise<User> {
  await authenticate()
  const user = await newUser({
    name: "Anonymous",
    wallet: walletAddress,
    wallets: {
      create: {
        address: walletAddress,
        chain,
        //network
      },
    },
  })
  if(tba){
    console.log('TBA will be created for user ', user)
    const tba = await newTokenBoundAccount(EntityType.user, user.id)
    console.log('TBA created', tba)
  }
  return user
}
