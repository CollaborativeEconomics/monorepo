import appConfig from "@cfce/app-config"
import { Address, nativeToScVal } from "@stellar/stellar-sdk"
import { checkContract } from "~/contracts/credits/server"
import { networks } from "~/contracts/networks"

export default async function restoreContract(contractId: string) {
  try {
    console.log("Restore Credits Contract", contractId)
    if (!contractId) {
      return { success: false, error: "Contract id not provided" }
    }
    if (
      !process.env.CFCE_MINTER_WALLET_ADDRESS ||
      !process.env.CFCE_MINTER_WALLET_SECRET
    ) {
      return { success: false, error: "Missing environment variables" }
    }
    const network =
      networks[
        appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network
      ]
    console.log("NET", network)
    const from = new Address(process.env.CFCE_MINTER_WALLET_ADDRESS).toScVal()
    const secret = process.env.CFCE_MINTER_WALLET_SECRET
    const method = "donate"
    const amount = nativeToScVal("10000000", { type: "i128" }) // 100 stroops to allow percent fees
    const args = [from, amount]
    const result = await checkContract(
      network,
      secret,
      contractId,
      method,
      args,
    )
    console.log("Restore Result", result)
    return result
  } catch (ex) {
    console.error("Error restoring", ex)
    return {
      success: false,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}
