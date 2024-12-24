"use server"
import { getChainConfigurationByName } from "@cfce/blockchain-tools"
import type { AuthTypes, Chain, Network } from "@cfce/types"
import { signIn } from "../nextAuth"
import { createAnonymousUser } from "./createNewUser"
import fetchUserByWallet from "./fetchUserByWallet"

export default async function walletLogin(
  method: AuthTypes,
  {
    walletAddress,
    network,
    chain,
  }: { walletAddress: string; network: Network; chain: Chain },
) {
  const config = getChainConfigurationByName(chain)
  if (!config) {
    throw new Error(`No chain config found for chain: ${chain}`)
  }

  console.log("Wallet", walletAddress)
  let user = await fetchUserByWallet(walletAddress)
  console.log("WALLET USER", user)
  if (user === null) {
    console.log("ANONYMOUS USER...")
    user = await createAnonymousUser({
      walletAddress,
      chain: config.name,
      network,
      tba: true,
    })
  }

  if (!user) {
    throw new Error("User not found or created")
  }

  const res = await signIn(method, {
    redirect: false,
    callbackUrl: `/profile/${user.id}`,
    address: walletAddress,
    // chainName,
    // chainId,
    network,
    // currency,
  })

  if (!res?.error) {
    // Instead of redirecting, return the URL
    return `/profile/${user.id}`
  }

  throw new Error(res?.error || "Sign in failed")
}
