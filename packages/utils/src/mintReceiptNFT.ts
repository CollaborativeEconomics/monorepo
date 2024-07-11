import { Chain } from "@cfce/blockchain-tools/dist/chains/ChainBaseClass"

interface mintReceiptNFTNativeParams {
  chain: Chain
  contractId: string
  address: string
  amount: number
  tokenId: string
}
const mintReceiptNFTNative = async ({ chain, contractId, address, tokenId }: mintReceiptNFTNativeParams) => {

}

interface mintReceiptNFTCCParams {
  chain?: Chain
  contractId: string
  address: string
  amount: number
  tokenId: string
}
const mintReceiptNFTCC = async ({ chain, contractId, address, tokenId }: mintReceiptNFTCCParams) => {

}

export { mintReceiptNFTNative, mintReceiptNFTCC }