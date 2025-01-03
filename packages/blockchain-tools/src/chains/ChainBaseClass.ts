import type {
  ChainConfig,
  ChainSlugs,
  Network,
  NetworkConfig,
  TokenTickerSymbol,
} from "@cfce/types"
import type { Web3 } from "web3"
import type { Transaction } from "../types/transaction"
import chainConfiguration from "./chainConfig"

export default abstract class ChainBaseClass {
  public chain: ChainConfig
  public network: NetworkConfig

  constructor(chainSlug: ChainSlugs, network: Network) {
    this.chain = chainConfiguration[chainSlug]
    this.network = this.chain.networks[network]
  }

  // isometric functions, must be defined on all subclasses
  public abstract getTransactionInfo(
    txId: string
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

  // client functions, only defined on client subclasses
  public connect?(): Promise<
    | { success: boolean; error: string }
    | { success: boolean; network: Network; walletAddress: string }
  >

  // server functions, only defined on server subclasses
  public web3?: Web3
  
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
  
  public async mintNFT1155?(params: {
    address: string
    tokenId: string
    uri: string
    contractId: string
    walletSeed: string
  }): Promise<{
    success: boolean
    txId?: string
    tokenId?: string
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
    const wei = 10 ** this.network.decimals
    return Number(amount) / wei
  }

  toBaseUnit(amount: number): bigint {
    console.log('DECS', this.network.decimals)
    const wei = Math.floor(amount * 10 ** this.network.decimals)
    console.log('WEI', wei)
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

  sendPaymentWithGas?(address: string, amount: number): Promise<{
    success: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    result?: any;
    error?: string;
    txid?: string;
    walletAddress?: string;
  }>;
}
