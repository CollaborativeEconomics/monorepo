import appConfig from "@cfce/app-config"
import { Address } from "@stellar/stellar-sdk"
import { networks } from "~/contracts/networks"
import { checkContract } from "~/contracts/nft721/server"

export default async function restoreContract(contractId: string) {
  try {
    console.log("Restore NFT721 Contract", contractId)
    if (!contractId) {
      return { success: false, error: "Contract id not provided" }
    }
    if (
      !appConfig.chains.stellar?.contracts?.receiptMintbotERC721 ||
      !process.env.STELLAR_WALLET_SECRET
    ) {
      return { success: false, error: "Missing environment variables" }
    }
    const network =
      networks[
        appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network
      ]
    const to = new Address(
      appConfig.chains.stellar?.contracts?.receiptMintbotERC721,
    ).toScVal()
    const secret = process.env.STELLAR_WALLET_SECRET
    const method = "mint"
    const args = [to]
    const result = await checkContract(
      network,
      secret,
      contractId,
      method,
      args,
    )
    return result
  } catch (ex) {
    console.error(ex)
    return {
      success: false,
      error:
        ex instanceof Error
          ? ex.message
          : "Unknown error restoring 721 contract",
    }
  }
}
