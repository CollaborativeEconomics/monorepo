"use server"
import { type Chain, type User, getUserByWallet, newUser } from "@cfce/database"
import { getServerSession } from "next-auth/next"
import { getSession } from "next-auth/react"
import { authOptions } from "../auth/nextAuth"
import { EntityType } from "@cfce/types"
import { newTBAccount } from "@cfce/tbas"
import { v7 as uuidv7 } from "uuid"

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
  // await authenticate()
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

export async function createNewUser(data: User, tba = false) {
  await authenticate()
  const user = await newUser(data)
  if(tba && user?.id){
    console.log('TBA will be created for user ', user.id)
    const account = await newTBAccount(EntityType.user, user.id)
    console.log('TBA created', account)
  }
  return user
}

export async function createAnonymousUser(walletAddress: string, chain: Chain, network: string, tba = false) {
  //await authenticate()
  const uuid = uuidv7()
  const mail = `_${uuid.substr(-10)}@example.com`
  const data = {
    api_key: uuid,
    api_key_enabled: false,
    created: new Date(),
    description: "",
    email: mail,
    emailVerified: false,
    image: "",
    inactive: false,
    name: "Anonymous",
    type: 0,
    wallet: walletAddress,
    wallets: {
      create: [
        {
          chain: chain as Chain,
          network: network || 'testnet',
          address: walletAddress
        }
      ]
    }
  }
  const user = await newUser(data)
  if(tba && user?.id){
    console.log('TBA will be created for user ', user.id)
    const account = await newTBAccount(EntityType.user, user.id)
    console.log('TBA created', account)
  }
  return user
}

/*
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
*/