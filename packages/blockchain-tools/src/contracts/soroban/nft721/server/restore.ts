import { chainConfig } from "@cfce/app-config"
import { Address } from "@stellar/stellar-sdk"
import { getWalletSecret } from "../../../../getWalletSecret"
import { checkContract } from "../../credits/server"

export default async function restoreContract(contractId: string) {
  try {
    console.log("Restore NFT721 Contract", contractId)
    if (!contractId) {
      return { success: false, error: "Contract id not provided" }
    }

    // Use testnet network configuration from chainConfig
    const network = chainConfig.stellar.networks.testnet
    const walletAddress = network.wallet

    if (!walletAddress) {
      return {
        success: false,
        error: "Wallet address not configured in network settings",
      }
    }

    const to = new Address(walletAddress).toScVal()
    const secret = getWalletSecret("stellar")
    const method = "mint"
    const args = [to]

    const result = await checkContract({
      network: {
        soroban: network.rpcUrls.soroban,
        networkPassphrase: network.networkPassphrase,
      },
      secret,
      contractId,
      method,
      args,
    })

    return result
  } catch (error) {
    console.error(error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: errorMessage }
  }
}
