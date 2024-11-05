import { BlockchainManager, chainConfig } from "@cfce/blockchain-tools"
import type { User } from "@cfce/database"
import type { AuthTypes, ChainSlugs } from "@cfce/types"
import { getDefaultStore } from "jotai"
import { signIn } from "./auth/nextAuth"
import { registryApi } from "./registryApi"
// import { createNewUser, fetchUserByWallet } from "./server-actions/user"
import { appSettingsAtom } from "./state"

export default async function loginOrCreateUserFromWallet({
  chain,
  method,
}: { chain: ChainSlugs; method: AuthTypes }) {
  try {
    console.log("LOGIN", { chain, method })
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
    let { data: user } = await registryApi.get<User>(
      `/users?wallet=${walletAddress}`,
    )
    console.log("got user", user)
    if (!user) {
      // server action
      // user = await createNewUser(walletAddress, chainName)
      const response = await registryApi.post<User>("/users", {
        name: "Anonymous",
        wallet: walletAddress,
        wallets: {
          create: {
            address: walletAddress,
            chain,
          },
        },
      })
      user = response.data
      console.log("created user", user)
    }

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
