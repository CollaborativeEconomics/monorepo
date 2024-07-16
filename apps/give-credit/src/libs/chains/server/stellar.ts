//import * as StellarSdk from '@stellar/stellar-sdk'
import { WalletProvider } from "@/src/types/common"
import { networks } from "@/src/contracts/networks"
//import { Contract } from '@/contracts/nft721/client/index'

interface MintResponse {
  success?: boolean
  error?: string | boolean
  tokenId?: string
}

type Dictionary = { [key: string]: any }
type Callback = (data: Dictionary) => void

class StellarServer {
  chain = "Stellar"
  symbol = "XLM"
  network = process.env.NEXT_PUBLIC_STELLAR_NETWORK
  provider: WalletProvider
  mainnet = {
    id: 0,
    name: "Stellar Mainnet",
    symbol: "XLM",
    decimals: 6,
    gasprice: "",
    explorer: "",
    rpcUrl: "https://horizon.stellar.org",
    soroban: process.env.STELLAR_SOROBAN,
    phrase: "Public Global Stellar Network ; September 2015",
    wssurl: "",
  }
  testnet = {
    id: 0,
    name: "Stellar Testnet",
    symbol: "XLM",
    decimals: 6,
    gasprice: "",
    explorer: "",
    rpcUrl: "https://horizon-testnet.stellar.org",
    soroban: "https://soroban-testnet.stellar.org",
    phrase: "Test SDF Network ; September 2015",
    wssurl: "",
  }
  futurenet = {
    id: 0,
    name: "Stellar Futurenet",
    symbol: "XLM",
    decimals: 6,
    explorer: "",
    rpcUrl: "https://horizon-futurenet.stellar.org",
    soroban: "https://rpc-futurenet.stellar.org",
    phrase: "Test SDF Future Network ; October 2022",
    wssurl: "",
  }

  constructor() {
    this.provider = this.network == "mainnet" ? this.mainnet : this.testnet
  }

  toWei(num: number) {
    const wei = 10 ** this.provider.decimals
    return num * wei
  }

  fromWei(num: number) {
    const wei = 10 ** this.provider.decimals
    return num / wei
  }

  async fetchLedger(query: any) {
    try {
      let url = this.provider.rpcUrl + query
      console.log("FETCH", url)
      let options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
      let result = await fetch(url, options)
      let data = await result.json()
      return data
    } catch (ex: any) {
      console.error(ex)
      return { error: ex.message }
    }
  }

  async getTransactionInfo(txid: string) {
    console.log("Get tx info by txid", txid)
    let txInfo = await this.fetchLedger("/transactions/" + txid)
    if (!txInfo || "error" in txInfo) {
      console.log("ERROR", "Transaction not found:", txid)
      return { error: "Transaction not found" }
    }
    if (!txInfo?.successful) {
      console.log("ERROR", "Transaction not valid")
      return { error: "Transaction not valid" }
    }
    console.log("TXINFO", txInfo)
    const tag = txInfo.memo?.indexOf(":") > 0 ? txInfo.memo?.split(":")[1] : ""
    const opid = (BigInt(txInfo.paging_token) + BigInt(1)).toString()
    const opInfo = await this.fetchLedger("/operations/" + opid)
    const result = {
      success: true,
      account: txInfo.source_account,
      amount: opInfo?.amount,
      destination: opInfo?.to,
      destinationTag: tag,
    }
    return result
  }
}

const Stellar = new StellarServer()

export default Stellar
