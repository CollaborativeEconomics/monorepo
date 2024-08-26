import {
  BlockchainManager,
  type ChainSlugs,
  ClientInterfaces,
  type Interfaces,
  getChainConfiguration,
  getWalletConfiguration,
} from "@cfce/blockchain-tools"
import { type User, getUserByWallet, newUser } from "@cfce/database"
import { getDefaultStore } from "jotai"
import { signIn } from "next-auth/react"
import { appSettingsAtom } from "./state"

export default async function loginOrCreateUserFromWallet({
  chain,
}: { chain: ChainSlugs }) {
  console.log("LOGIN")
  const walletInterface = BlockchainManager.getInstance()[chain]?.client // TODO: handle multiple wallets per chain
  if (!walletInterface) {
    throw new Error(`No wallet interface found for chain: ${chain}`)
  }

  const chainConfig = getChainConfiguration([chain])[0]

  const { network, walletAddress } = await walletInterface.connect()
  if (!walletAddress) {
    throw new Error(`No wallet address found: ${walletAddress}`)
  }
  const chainNetwork = chainConfig.networks[network]
  if (!chainNetwork) {
    throw new Error(`No chain network found: ${network}`)
  }

  console.log("Wallet", walletAddress)
  const chainName = chainConfig.name
  const chainId = chainNetwork.id
  let user = (await getUserByWallet(walletAddress)) as User
  if (!user) {
    user = await newUser({
      name: "Anonymous",
      wallet: walletAddress,
      wallets: {
        create: {
          address: walletAddress,
          chain: chainConfig.name,
        },
      },
    })
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
    currency: chainConfig.symbol,
  })
}
