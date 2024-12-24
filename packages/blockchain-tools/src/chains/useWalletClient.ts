import { chainAtom } from "@cfce/state"
import type { ClientInterfaces } from "@cfce/types"
import { useAtomValue } from "jotai"
import { BlockchainClientInterfaces } from "./BlockchainManager"
import type InterfaceBaseClass from "./InterfaceBaseClass"

export function useWalletClient(): InterfaceBaseClass | undefined {
  const { selectedChain, selectedWallet } = useAtomValue(chainAtom)

  try {
    // we override the inferred type so TS doesn't complain about the specific client not being present (e.g. {argent} doesn't exist in {metamask})
    const chainClient = BlockchainClientInterfaces[selectedWallet]
    if (!chainClient) {
      console.warn(`No clients found for chain: ${selectedChain}`)
      return undefined
    }

    return chainClient
  } catch (error) {
    console.error("Error getting wallet client:", error)
    return undefined
  }
}
