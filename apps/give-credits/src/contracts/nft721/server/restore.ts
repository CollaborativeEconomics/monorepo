import { networks } from "@/src/contracts/networks"
import { checkContract } from "@/src/contracts/nft721/server"
import { Address } from "@stellar/stellar-sdk"

export default async function restoreContract(contractId: string) {
  try {
    console.log("Restore NFT721 Contract", contractId)
    if (!contractId) {
      return { success: false, error: "Contract id not provided" }
    }
    if (
      !process.env.NEXT_PUBLIC_STELLAR_NETWORK ||
      !process.env.CFCE_MINTER_WALLET_ADDRESS ||
      !process.env.CFCE_MINTER_WALLET_SECRET
    ) {
      return { success: false, error: "Missing environment variables" }
    }
    const network = networks[process.env.NEXT_PUBLIC_STELLAR_NETWORK]
    const to = new Address(process.env.CFCE_MINTER_WALLET_ADDRESS).toScVal()
    const secret = process.env.CFCE_MINTER_WALLET_SECRET
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
