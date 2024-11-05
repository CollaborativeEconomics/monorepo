"use client"
import {
  BlockchainManager,
  chainConfig,
  getChainConfiguration,
} from "@cfce/blockchain-tools"
import type { AuthTypes, ChainSlugs } from "@cfce/types"
import { getDefaultStore } from "jotai"
import { signIn } from "next-auth/react"
import { createNewUser, fetchUserByWallet } from "./server-actions/user"
import { appSettingsAtom } from "./state"
import type { User } from "@cfce/database"

export default async function loginOrCreateUserFromWallet({
  chain, method
}: { chain: ChainSlugs, method: AuthTypes }) {
  try {
    console.log("LOGIN")
    const walletInterface = BlockchainManager[chain]?.client // TODO: handle multiple wallets per chain
    if (!walletInterface) {
      throw new Error(`No wallet interface found for chain: ${chain}`)
    }

    const config = chainConfig[chain]

    const { network, walletAddress } = await walletInterface.connect()
    console.log("After wallet connect:", { network, walletAddress })
    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`)
    }
    const chainNetwork = config.networks[network]
    console.log("Chain network:", chainNetwork)
    if (!chainNetwork) {
      throw new Error(`No chain network found: ${network}`)
    }

    console.log("Wallet", walletAddress)
    const chainName = config.name
    const chainId = chainNetwork.id
    // server action
    console.log("About to fetch user...")
    let user = await fetchUserByWallet(walletAddress)

    if (user === null) {
      user = await createNewUser(walletAddress, chainName)
    }

    console.log("UserId", user?.id)

    getDefaultStore().set(appSettingsAtom, (draft) => {
      draft.walletAddress = walletAddress
      draft.userId = user?.id
    })

    await signIn(method, {
      callbackUrl: `/profile/${user.id}`,
      address: walletAddress,
      chainName,
      chainId,
      network,
      currency: config.symbol,
    })
  } catch (error) {
    console.error("Error during login or user creation:", error)
    // Handle error appropriately, e.g., show a notification to the user
  }
}
