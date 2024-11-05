"use server"
import type { AuthTypes, ChainConfig } from "@cfce/types"
import { signIn } from "next-auth/react"
import { createNewUser, fetchUserByWallet } from "./createNewUser"

export default async function loginOrCreateUserFromWallet(
  method: AuthTypes,
  {
    walletAddress,
    chainConfig,
    network,
  }: {
    walletAddress: string
    chainConfig: ChainConfig
    network: string
  },
) {
  try {
    if (!network) {
      throw new Error(`No network found: ${network}`)
    }

    console.log("After wallet connect:", { network, walletAddress })
    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`)
    }
    const chainNetwork = chainConfig.networks[network]
    console.log("Chain network:", chainNetwork)
    if (!chainNetwork) {
      throw new Error(`No chain network found: ${network}`)
    }

    console.log("Wallet", walletAddress)
    const chainName = chainConfig.name
    const chainId = chainNetwork.id
    const currency = chainNetwork.symbol
    let user = await fetchUserByWallet(walletAddress)

    if (user === null) {
      user = await createNewUser(walletAddress, chainConfig.name)
    }

    console.log("UserId", user?.id)

    await signIn(method, {
      callbackUrl: `/profile/${user.id}`,
      address: walletAddress,
      chainName,
      chainId,
      network,
      currency,
    })
  } catch (error) {
    console.error("Error during login or user creation:", error)
    // Handle error appropriately, e.g., show a notification to the user
  }
}
