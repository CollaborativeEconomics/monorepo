import type { ChainSlugs } from "@cfce/blockchain-tools/dist/chains/chainConfig"

interface mintReceiptNFTNativeParams {
  chain: ChainSlugs
  contractId: string
  address: string
  amount: number
  tokenId: string
}
const mintReceiptNFTNative = async ({
  chain,
  contractId,
  address,
  tokenId,
}: mintReceiptNFTNativeParams) => {}

interface mintReceiptNFTCCParams {
  chain?: ChainSlugs
  contractId: string
  address: string
  amount: number
  tokenId: string
}
const mintReceiptNFTCC = async ({
  chain,
  contractId,
  address,
  tokenId,
}: mintReceiptNFTCCParams) => {}

export { mintReceiptNFTNative, mintReceiptNFTCC }
