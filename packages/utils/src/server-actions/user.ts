"use server"
import { type Chain, type User, getUserByWallet, newUser } from "@cfce/database"
import { getServerSession } from "next-auth/next"
import { getSession } from "next-auth/react"
import { authOptions } from "../auth/nextAuth"
import { createAccount } from "@cfce/tbas"

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

export async function createNewUser(
  walletAddress: string,
  chain: Chain,
  network: string,
  tba: boolean = false
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
    // TODO: 
    // - mint nft for tba in main 721 contract
    //const tokenId = await mintNFTCC(...)
    const tokenId = '0'
    const tokenContract = '0xdFDf018665F2C5c18a565ce0a2CfF0EA2187ebeF'
    const chainId = '51'
    // - create token bound account for user in xdc
    const okTBA = await createAccount(tokenContract, tokenId, chainId)
    // - add tba record to db
    if(okTBA){
      //const okDB = await newAccount()
    }
  }
  return user
}
