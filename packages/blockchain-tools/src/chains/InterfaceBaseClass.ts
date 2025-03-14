import type {
  Chain,
  ChainConfig,
  ChainSlugs,
  NetworkConfig,
  TokenTickerSymbol,
} from "@cfce/types"
import type { Web3 } from "web3"
import type { Transaction } from "../types/transaction"

export default abstract class InterfaceBaseClass {
  public chain?: ChainConfig
  public network?: NetworkConfig

  // isometric functions, must be defined on all subclasses
  public abstract getTransactionInfo(
    txId: string,
  ): Promise<Transaction | { error: string }>

  // TODO: improve types
  public abstract fetchLedger(method: unknown, params: unknown): unknown

  public async sendPayment?(params: {
    address: string
    amount: number
    memo: string
    walletSeed?: string
  }): Promise<{
    success: boolean
    error?: string
    txid?: string
    walletAddress?: string
  }>

  public async sendToken?(params: {
    address: string
    amount: number
    token: TokenTickerSymbol
    memo: string
    walletSeed?: string
  }): Promise<{
    success: boolean
    error?: string
    txid?: string
    walletAddress?: string
  }>

  public async getBalance?(): Promise<
    | {
        success: boolean
        balance: number
      }
    | {
        success: boolean
        error: string
      }
  >

  // client functions, only defined on client subclasses
  public connect?(chainSlug?: ChainSlugs): Promise<
    | { success: boolean; error: string }
    | {
        success: boolean
        chain: Chain
        network: NetworkConfig
        walletAddress: string
      }
  >

  public getAddress?(): Promise<string | null>

  public isConnected() {
    return (
      typeof this.chain !== "undefined" && typeof this.network !== "undefined"
    )
  }

  // server functions, only defined on server subclasses
  public web3?: Web3

  public async sendToContract?(params: {
    contractId: string
    amount: number
    isFirstTime?: boolean
  }): Promise<{
    success: boolean
    txId?: string
    error?: string
    walletAddress?: string
  }>

  public async mintNFT?(params: {
    address: string
    uri: string
    taxon?: number
    transfer?: boolean
    contractId: string
    walletSeed: string
  }): Promise<{
    success: boolean
    txId?: string
    tokenId?: string
    error?: string
  }>

  public async mintNFT721?(params: {
    address: string
    tokenId: string
    contractId: string
    walletSeed: string
    metadataUri: string
  }): Promise<{
    success: boolean
    txId?: string
    tokenId?: string
    error?: string
  }>

  public async mintNFT1155?(params: {
    address: string
    tokenId: number
    uri: string
    contractId: string
    walletSeed: string
  }): Promise<{
    success: boolean
    txId?: string
    tokenId?: number
    error?: string
  }>

  // XRPL only?
  public async createSellOffer?(params: {
    tokenId: string
    destinationAddress: string
    offerExpirationDate?: string
  }): Promise<{ success: boolean; offerId?: string; error?: string }>

  // utility functions
  fromBaseUnit(amount: bigint): number {
    if (!this.network) {
      throw new Error("Network not set, connect or setChain first")
    }
    const wei = 10 ** (this.network.decimals ?? 18)
    return Number(amount) / wei
  }

  toBaseUnit(amount: number): bigint {
    if (!this.network) {
      throw new Error("Network not set, connect or setChain first")
    }
    const wei = Math.floor(amount * 10 ** (this.network.decimals ?? 18))
    return BigInt(wei)
  }

  toHex(str: string) {
    return `0x${Number.parseInt(str).toString(16)}`
  }

  strToHex(str: string) {
    if (!str) {
      return ""
    }
    return `0x${Buffer.from(str.toString(), "utf8").toString("hex")}`
  }

  hexToStr(hex: string, encoding: BufferEncoding = "utf8") {
    if (!hex) {
      return ""
    }
    return Buffer.from(hex.substr(2), "hex").toString(encoding)
  }

  sendGaslessPayment?(params: {
    address: string
    amount: number
    memo?: string
    walletSeed?: string
  }): Promise<{
    success: boolean
    error?: string
    txid?: string
    walletAddress?: string
  }>
}
