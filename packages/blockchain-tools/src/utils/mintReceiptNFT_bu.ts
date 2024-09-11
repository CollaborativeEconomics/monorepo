import type { ChainSlugs } from "@cfce/types"

interface mintAndSaveReceiptNFTNativeParams {
  chain: ChainSlugs
  contractId: string
  address: string
  amount: number
  tokenId: string
}
const mintAndSaveReceiptNFTNative = async ({
  chain,
  contractId,
  address,
  tokenId,
}: mintAndSaveReceiptNFTNativeParams) => {}

interface mintAndSaveReceiptNFTCCParams {
  chain?: ChainSlugs
  contractId: string
  address: string
  amount: number
  tokenId: string
}
const mintAndSaveReceiptNFTCC = async ({
  chain,
  contractId,
  address,
  tokenId,
}: mintAndSaveReceiptNFTCCParams) => {}

export { mintAndSaveReceiptNFTNative, mintAndSaveReceiptNFTCC }
