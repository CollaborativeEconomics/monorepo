import type {
  ChainConfig,
  ChainSlugs,
  Network,
  NetworkConfig,
  TokenTickerSymbol,
} from "./chainConfig"
import type { Web3 } from "web3"
import chainConfiguration from "./chainConfig"

export default abstract class ChainBaseClass {
  public chain: ChainConfig
  public network: NetworkConfig

  constructor(chainSlug: ChainSlugs, network: Network) {
    this.chain = chainConfiguration[chainSlug]
    this.network = chainConfiguration[chainSlug].networks[network]
  }

  // isometric functions, must be defined on all subclasses
  public abstract getTransactionInfo(txid: string): unknown
  public abstract fetchLedger(method: unknown, params: unknown): unknown

  // client functions, only defined on client subclasses
  public connect?(callback: (data: unknown) => void): void {}
  public async sendPayment?(
    address: string,
    amount: number,
    destinTag: string,
  ): Promise<void> {}
  public async sendToken?(
    address: string,
    amount: number,
    token: TokenTickerSymbol,
    destinTag: string,
  ): Promise<void> {}

  // server functions, only defined on server subclasses
  public web3?: Web3
  walletSeed?: string // For minting NFTs and such
  contract?: string // For minting NFTs and such
  public async mintNFT?(
    uri: string,
    donor: string,
    taxon: number,
    transfer: boolean,
    contract: string,
  ): Promise<unknown> {
    return null
  }
  public async mintNFT1155?(
    address: string,
    tokenId: string,
    uri: string,
    contract: string,
  ): Promise<unknown> {
    return null
  }
  public async createSellOffer?(
    tokenId: string,
    destinationAddress: string,
    offerExpirationDate?: string,
  ): Promise<unknown> {
    return null
  }

  // utility functions
  fromBaseUnit(amount: number): number {
    const wei = 10 ** this.network.decimals
    return amount / wei
  }

  toBaseUnit(amount: number): number {
    const wei = 10 ** this.network.decimals
    return amount * wei
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
}
