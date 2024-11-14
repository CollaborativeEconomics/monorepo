"use server"
import type { Chain } from "@cfce/database"
import type { AuthTypes, ChainConfig } from "@cfce/types"
import { signIn } from "../nextAuth"
import { createAnonymousUser } from "./createNewUser"
import fetchUserByWallet from "./fetchUserByWallet"

export default async function walletLogin(
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
    user = await createAnonymousUser({
      walletAddress,
      chain: chainConfig.name as Chain,
      network,
      tba: true,
    })
  }

  if (!user) {
    throw new Error("User not found or created")
  }

  await signIn(method, {
    // redirect: false,
    callbackUrl: `/profile/${user.id}`,
    address: walletAddress,
    chainName,
    chainId,
    network,
    currency,
  })
}