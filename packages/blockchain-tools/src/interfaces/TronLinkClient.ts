/// <reference path="./tronlink.d.ts" />

import type {
  ChainSlugs,
  Network,
  NetworkConfig,
  TokenTickerSymbol,
} from "@cfce/types"
import ChainBaseClass from "../chains/ChainBaseClass"
import erc20abi from "../contracts/solidity/erc20/erc20-abi.json"
import type { Transaction } from "../types/transaction"

export default class TronLinkWallet extends ChainBaseClass {
  connectedWallet = ""
  wallets?: string[]
  //metamask?: MetaMaskInpageProvider
  //tronWeb?: TronLinkInpageProvider
  //web3?: Web3

  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    //this.web3 = new Web3(this.network.rpcUrl)
  }

  async connect() {
    console.log("Wallet starting...", this.network)
    console.log("TronWeb", window.tronWeb)
    try {
      const request = await window.tronWeb.request({method: 'tron_requestAccounts'})
      if(request.code==200){
        this.connectedWallet = window.tronWeb.defaultAddress?.base58 || ""
        return {
          success: true,
          network: this.network.slug,
          walletAddress: this.connectedWallet,
        }
      } else {
        return { success: false, error: "Can't connect to TronLink wallet" }
      }
    } catch (ex) {
      const error = ex instanceof Error ? ex.message : ""
      console.error("Error", error)
      return { success: false, error }
    }
  }

  async isConnected(window: Window) {
    if (window.tronWeb) {
      const connected = await window.tronWeb.isConnected()
      return connected?.fullNode==true
    }
    return false
  }

  setListeners() {}

  setNetwork(chainId: string) {}

  async changeNetwork(provider: NetworkConfig) {}

  async loadWallet(window: Window) {}

  requestAccount() {}

  async getAccounts() {}

  async getAddress(): Promise<string | null> { return null }

  async getBalance(address: string): Promise<string | undefined | null> { return null }

  async getGasPrice(): Promise<string | undefined> { return "" }

  async getTransactionInfo(txid: string) { return { error: "Not ready" } }

  async sendPayment({address, amount, memo}: { address: string; amount: number; memo: string }) {
    return { success: false, error: "Not ready" }
  }

  async sendToken({
      address,
      amount,
      token,
      contract,
      memo,
    }: {
      address: string
      amount: number
      token: TokenTickerSymbol
      contract: string
      memo: string
  }) {
      return { success: false, error: "Not ready" }
  }

  async fetchLedger(method: unknown, params: unknown): Promise<unknown> {
    return { error: "Not ready" }
  }

}

