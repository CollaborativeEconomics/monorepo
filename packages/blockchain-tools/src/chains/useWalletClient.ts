import { chainAtom } from "@cfce/state"
import type { ClientInterfaces } from "@cfce/types"
import { useAtomValue } from "jotai"
import BlockchainManager from "./BlockchainManager"
import type InterfaceBaseClass from "./InterfaceBaseClass"

export function useWalletClient(): InterfaceBaseClass | undefined {
  const { selectedChain, selectedWallet } = useAtomValue(chainAtom)

  try {
    // we override the inferred type so TS doesn't complain about the specific client not being present (e.g. {argent} doesn't exist in {metamask})
    const chainClients: Partial<Record<ClientInterfaces, InterfaceBaseClass>> =
      BlockchainManager[selectedChain]?.client
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
