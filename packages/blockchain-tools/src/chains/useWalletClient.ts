import { chainAtom } from "@cfce/state"
import { useAtomValue } from "jotai"
import BlockchainManager from "./BlockchainManager"
import type ChainBaseClass from "./ChainBaseClass"

export function useWalletClient(): ChainBaseClass | undefined {
  const { selectedChain, selectedWallet } = useAtomValue(chainAtom)

  try {
    const chainClients = BlockchainManager[selectedChain]?.client
    if (!chainClients) {
      console.warn(`No clients found for chain: ${selectedChain}`)
      return undefined
    }

    const walletClient = chainClients[selectedWallet]
    if (!walletClient) {
      console.warn(
        `No wallet client found for ${selectedWallet} on chain ${selectedChain}`,
      )
      return undefined
    }

    return walletClient
  } catch (error) {
    console.error("Error getting wallet client:", error)
    return undefined
  }
}
