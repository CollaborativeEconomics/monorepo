import type { ChainSlugs, Network } from "@cfce/types"
import ChainBaseClass from "../chains/ChainBaseClass"
import Abi721 from "../contracts/solidity/erc721/erc721-abi.json"
import Abi1155 from "../contracts/solidity/erc1155/erc1155-abi.json"

export default class TronServer extends ChainBaseClass {
  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
  }

  async getGasPrice(minter: string, contractId: string, data: string) {
    return { gasPrice:0, gasLimit:0 }
  }

  async mintNFT({
    uri,
    address,
    contractId,
    walletSeed,
  }: { uri: string; address: string; contractId: string; walletSeed: string }) {
    console.log(this.chain, "Server minting NFT 721 to", address, uri)
    return { success: false, error: "Not ready" }
  }

  // address is receiver, tokenId is db impact id, uri is ipfs:metadata
  async mintNFT1155({
    address,
    tokenId,
    uri,
    contractId,
    walletSeed,
  }: {
    address: string
    tokenId: string
    uri: string
    contractId: string
    walletSeed: string
  }) {
    console.log(this.chain, "Server minting NFT 1155 to", address, uri)
    return { success: false, error: "Not ready" }
  }

  async createSellOffer({
    tokenId,
    destinationAddress,
  }: {
    tokenId: string
    destinationAddress: string
    offerExpirationDate?: string
  }) {
    console.log("Creating sell offer", tokenId, destinationAddress)
    // TODO: Implementation for creating a sell offer
    return { success: false, error: "createSellOffer method not implemented." }
  }

  async sendPayment({
    address,
    amount,
    memo,
    walletSeed,
  }: {
    address: string
    amount: number
    memo: string
    walletSeed: string
  }) {
    console.log("Sending payment...")
    return { success: false, error: "Not ready" }
  }

  async getTransactionInfo(txId: string) {
    return { error: "Not ready" }
  }

  async fetchLedger(method: string, params: unknown) {
    return { error: "Not ready" }
  }
}
