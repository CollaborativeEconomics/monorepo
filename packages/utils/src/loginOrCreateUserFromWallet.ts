"use client"
import {
  BlockchainManager,
  chainConfig,
  getChainConfiguration,
} from "@cfce/blockchain-tools"
import type { ChainSlugs } from "@cfce/types"
import { getDefaultStore } from "jotai"
import { signIn } from "next-auth/react"
import { createNewUser, fetchUserByWallet } from "./server-actions/user"
import { appSettingsAtom } from "./state"

export default async function loginOrCreateUserFromWallet({
  chain,
}: { chain: ChainSlugs }) {
  try {
    console.log("LOGIN")
    const walletInterface = BlockchainManager[chain]?.client // TODO: handle multiple wallets per chain
    if (!walletInterface) {
      throw new Error(`No wallet interface found for chain: ${chain}`)
    }

    const config = chainConfig[chain]

    const { network, walletAddress } = await walletInterface.connect()
    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`)
    }
    const chainNetwork = config.networks[network]
    if (!chainNetwork) {
      throw new Error(`No chain network found: ${network}`)
    }

    console.log("Wallet", walletAddress)
    const chainName = config.name
    const chainId = chainNetwork.id
    // server action
    let user = await fetchUserByWallet(walletAddress)
    if (!user) {
      // server action
      const useTBA = true
      // TODO: pass user to createNewUser
      //user = await createNewUser(userData, chainName, network, useTBA)
      user = await createNewUser(walletAddress, chainName, network, useTBA)
    }
    console.log("UserId", user.id)

    getDefaultStore().set(appSettingsAtom, (draft) => {
      draft.walletAddress = walletAddress
      draft.userId = user.id
    })

    await signIn(chain, {
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
