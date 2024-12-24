/// <reference path="./metamask.d.ts" />

import type {
  ChainSlugs,
  Network,
  NetworkConfig,
  TokenTickerSymbol,
} from "@cfce/types"
import type { MetaMaskInpageProvider } from "@metamask/providers"
import Web3 from "web3"
import type {
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from "web3"
import { http, createConfig, connect, getBalance, sendTransaction, estimateGas } from '@wagmi/core'
import { mainnet, sepolia, arbitrumSepolia } from '@wagmi/core/chains'
import { injected } from '@wagmi/core'
import ChainBaseClass from "../chains/ChainBaseClass"
import erc20abi from "../contracts/solidity/erc20/erc20-abi.json"
import type { Transaction } from "../types/transaction"
import { formatUnits, parseEther } from 'viem'

export default class MetaMaskWallet extends ChainBaseClass {
  // neturl = ""
  // explorer = ""
  // network = "testnet"
  // provider?: NetworkConfig
  connectedWallet? = ""
  wallets?: string[]
  metamask?: MetaMaskInpageProvider
  web3?: Web3

  config = createConfig({
    chains: [arbitrumSepolia],
    transports: {
      // [mainnet.id]: http(),
      // [sepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
    },
  })

  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    this.web3 = new Web3(this.network.rpcUrls.main)
  }

  async connect() {
    console.log("Wallet starting...", this.network)
    //console.log('window.ethereum')
    try {

      const result = await connect(this.config, { connector: injected() })
      console.log("Result", result)
      this.connectedWallet = result.accounts[0]
      // this.metamask = window.ethereum
      // this.setListeners()
      this.wallets = [...result.accounts]
      // //console.log('Accounts', this.wallets)
      // this.connectedWallet = this.wallets ? this.wallets[0] : "" // TODO: handle multiple addresses
      //this.connectedWallet = this.metamask.selectedAddress
      //this.setNetwork(window.ethereum.chainId)
      //this.loadWallet(window))
      if (
        window.ethereum?.chainId &&
        this.network.id !== Number.parseInt(window.ethereum.chainId, 16)
      ) {
        await this.changeNetwork(this.network)
      }
      return {
        success: true,
        network: this.network.slug,
        walletAddress: this.connectedWallet,
      }
    } catch (ex) {
      const error = ex instanceof Error ? ex.message : ""
      console.error("Error", error)
      return { success: false, error }
    }
  }

  isConnected(window: Window) {
    if (window.ethereum) {
      return window.ethereum.isConnected() && window.ethereum.selectedAddress
    }
    return false
  }

  setListeners() {
    if (!this.metamask) {
      console.error("Metamask not available")
      return
    }
    // @ts-expect-error returns chain ID string
    this.metamask.on("connect", (info: ProviderConnectInfo) => {
      console.log("> onConnect", Number.parseInt(info.chainId), info.chainId)
      this.setNetwork(info.chainId)
      //if(restore){
      //  restore(this.network, this.connectedWallet)
      //}
      //this.loadWallet();
    })
    // @ts-expect-error returns error
    this.metamask.on("disconnect", (info: ProviderRpcError) => {
      console.log("> onDisconnect", info)
      //
      console.log("Disconnected")
    })
    // @ts-expect-error returns array of accounts
    this.metamask.on("accountsChanged", (info: string[]) => {
      console.log("> onAccounts", info)
      this.wallets = info
      this.connectedWallet = info[0]
      console.log("My account", this.connectedWallet)
      //if(restore){
      //  restore(this.network, this.connectedWallet)
      //}
      //this.getBalance(this.connectedWallet);
    })
    // @ts-expect-error returns chain ID string
    this.metamask.on("chainChanged", (chainId: string) => {
      console.log("> onChainChanged", Number.parseInt(chainId), chainId)
      if (chainId === this.network.id) {
        console.log("Already on chain", chainId)
        return
      }
      this.setNetwork(chainId)
      //if(restore){
      //  restore(this.network, this.connectedWallet)
      //}
      //this.loadWallet();
      //this.requestAccount();
      //this.getAccounts();
    })
    // @ts-expect-error returns message
    this.metamask.on("message", (info: ProviderMessage) => {
      console.log("> onMessage", info)
    })
    console.log("Listeners set")
  }

  setNetwork(chainId: string) {
    console.log("SetNetwork", chainId)
    //if(!chainId){ chainId = this.metamask.chainId; }
    //const mainnet = (chainId == '0x38') // 0x61 testnet
    //this.network  = mainnet ? 'bsc-mainnet' : 'bsc-testnet'
    //this.neturl   = mainnet ? this.MAINURL : this.TESTURL
    //this.explorer = mainnet ? this.MAINEXP : this.TESTEXP
    //this.chainId  = chainId
    // console.log("Network", this.network, this.chainId)
    this.network.id = chainId
  }

  async changeNetwork(provider: NetworkConfig) {
    if (!this.metamask) {
      console.error("Change network failed, Metamask not available")
      return
    }
    console.log("Metamask changing network to", provider.name, provider.id)
    const chainHex = this.toHex(`${provider.id}`)
    try {
      await this.metamask.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      })
    } catch (err) {
      console.log("Metamask error", err)
      // @ts-expect-error This error code indicates that the chain has not been added to MetaMask
      if (err?.code === 4902) {
        console.log("Metamask adding network...")
        try {
          await this.metamask.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainHex,
                chainName: provider.name,
                nativeCurrency: {
                  name: provider.symbol,
                  decimals: provider.decimals,
                  symbol: provider.symbol,
                },
                rpcUrls: [provider.rpcUrls.main],
                blockExplorerUrls: [provider.explorer],
              },
            ],
          })
          console.log("Network added!")
        } catch (ex) {
          console.error("Metamask error adding network", ex)
        }
      }
    }
  }

  async loadWallet(window: Window) {
    console.log("Loading wallet...", this.network)
    //web3.eth.getChainId().then(id => { console.log('ChainId', id) })
    //console.log('WEB3', web3);
    console.log("VER", Web3.version)

    if (window.ethereum && this.metamask) {
      //console.log('window.ethereum')
      if (this.metamask.isConnected()) {
        console.log("Already connected to", this.metamask.chainId)
        this.getAccounts()
        // const address = await this.getAddress();
        // this.getBalance(address);
      } else {
        console.log("Connecting...")
        const accounts = await this.metamask.enable()
        console.log("Enabled:", accounts)
        this.getAccounts()
        //const adr = await this.getAddress()
        //  this.getBalance(adr);
      }
    } else {
      console.log("Metamask not available")
    }
  }
  /*
    // Metamask Events
    async onConnect(info) {
      console.log('onConnect', info);
      // info.chainId
      //this.setNetwork(info.chainId);
      //this.loadWallet();
    }

    async onDisconnect(info) {
      console.log('onDisconnect', info)
      //
      console.log('Disconnected')
    }

    async onAccounts(info) {
      console.log('onAccounts', info)
      this.wallets = info;
      this.connectedWallet = info[0];
      console.log('My account', this.connectedWallet);
      this.getBalance(this.connectedWallet);
    }

    async onChain(chainId) {
      console.log('onChain', chainId)
      if(chainId==this.chainId) { console.log('Already on chain', chainId); return; }
      this.setNetwork(chainId);
      //this.loadWallet();
      //this.requestAccount();
      //this.getAccounts();
    }

    async onMessage(info) {
      console.log('onMessage', info)
    }
  */
  /*
  function requestAccount() {
      this.metamask.request({ method: 'eth_requestAccounts' }).then(onAccounts)
      .catch(err => {
        if (err.code === 4001) {
          console.log('User rejected');
          console.log('Please connect to Metamask wallet');
        } else {
          console.error('Connection error', err);
        }
      });
  }
  */

  async getAccounts() {
    console.log("Get accounts...")
    if (!this.metamask) {
      console.error("Error getting accounts, Metamask not available")
      return
    }
    try {
      let accounts = await this.metamask.request<string[]>({
        method: "eth_requestAccounts",
      })
      if (accounts?.length) {
        accounts = accounts.filter(Boolean)
        // metamask.request returns <T> => Partial<T>,
        // which for an array adds undefined ((string | undefined)[])
        // hence the type-forcing below
        this.wallets = (accounts ?? []) as string[]
        this.connectedWallet = accounts[0] ?? ""
        console.log("Accounts:", accounts)
        console.log("MyAccount:", this.connectedWallet)
        //onReady(this.connectedWallet, this.network)
      }
    } catch (err) {
      console.log("Error: User rejected")
      console.error(err)
      //onReady(null, 'User rejected connection'
    }
  }

  async getAddress(): Promise<string | null> {
    console.log("Get address...")
    if (!this.metamask) {
      console.error("Error getting address, Metamask not available")
      return null
    }
    try {
      const accounts = await this.metamask.request<string[]>({
        method: "eth_requestAccounts",
      })
      console.log("Account", accounts)
      if (!accounts) {
        console.error("Error getting address, Metamask not available")
        return null
      }
      this.connectedWallet = accounts[0] ?? ""
      //$('user-address').innerHTML = this.connectedWallet.substr(0,10)
      return this.connectedWallet
    } catch (err) {
      console.log("Error: Wallet not connected", err)
      //$('user-address').innerHTML = 'Not connected'
      //$('user-balance').innerHTML = '0.0000 BNB'
      return null
    }
  }

  async getBalance(): Promise<string | undefined | null> {

    console.log("Get balance...")
    try {
      const result = await connect(this.config, { connector: injected() })
      console.log("Connect result:", result)
      this.connectedWallet = result.accounts[0]
      this.metamask = window.ethereum
    } catch (error) {
      console.error("Error connecting to wallet:", error)
    }
    
    if (!this.metamask) {
      console.error("Error getting balance, Metamask not available")
      return
    }

    try {
        // Get native token balance
        // const balance = await this.metamask.request<string>({
        //   method: "eth_getBalance",
        //   params: [this.connectedWallet, "latest"],
        // })
        // if (!balance) {
        //   console.error("Error fetching balance, balance is null")
        //   return null
        // }
        const balance = await getBalance(this.config, {
          address: this.connectedWallet as `0x${string}`,
          blockTag: 'latest',
        })
        const balanceInETH = formatUnits(balance.value, balance.decimals)
        console.log("Balance", balanceInETH)
        return balanceInETH;
    } catch (error) {
      console.error("Error fetching balance:", error)
      return null
    }
  }

  async getGasPrice(): Promise<string | undefined> {
    if (!this.metamask) {
      console.error("Error getting gas price, Metamask not available")
      return
    }
    const gas = await this.metamask.request<string>({
      method: "eth_gasPrice",
      params: [],
    })
    if (typeof gas !== "string") {
      console.error("Error getting gas price, invalid response")
      return
    }
    console.log("Average gas price:", Number.parseInt(gas), gas)
    return gas
  }

  async getTransactionInfo(txid: string) {
    if (!this.metamask) {
      console.error("Error getting transaction info, Metamask not available")
      throw new Error("Error getting transaction info, Metamask not available")
    }
    try {
      const info = (await this.metamask.request({
        method: "eth_getTransactionByHash",
        params: [txid],
      })) as Transaction
      console.log("Transaction Info:", info)
      return info
    } catch (error) {
      throw new Error(`Error getting transaction info: ${error}`)
    }
  }

  // TODO: is this used?
  // async callContract(
  //   provider: any,
  //   abi: any,
  //   address: string,
  //   method: string,
  //   value: string,
  // ) {
  //   if (!this.metamask) {
  //     console.error("Error calling contract, Metamask not available")
  //     return
  //   }
  //   if (!this.web3) {
  //     console.error("Error calling contract, web3 not available")
  //     return
  //   }
  //   console.log("Call", address, method)
  //   const contract = new this.web3.eth.Contract(abi, address)
  //   const gas = { gasPrice: 1000000000, gasLimit: 275000 }
  //   //const res = contract.methods[method].call(gas)
  //   const data = contract.methods[method]().encodeABI()
  //   const tx = {
  //     from: this.connectedWallet, // my wallet
  //     to: address, // contract address
  //     value: value, // this is the value in wei to send
  //     data: data, // encoded method and params
  //   }
  //   const txHash = await this.metamask.request({
  //     method: "eth_sendTransaction",
  //     params: [tx],
  //   })
  //   console.log({ txHash })
  // }

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo: string }) {
    console.log(`Sending ${amount} to ${address}...`)
    
    try {
      if (!this.connectedWallet) {
        throw new Error("Wallet not connected")
      }

      // Connect first to ensure we have an active connection
      try {
        const result = await connect(this.config, { connector: injected() })
        console.log("Connect result:", result)
        this.connectedWallet = result.accounts[0]
        this.metamask = window.ethereum
      } catch (error) {
        console.error("Error connecting to wallet:", error)
        throw error
      }

      // Convert amount to wei using parseEther
      const value = parseEther(amount.toString())

      // Prepare transaction parameters
      const transaction = {
        account: this.connectedWallet as `0x${string}`,
        to: address as `0x${string}`,
        value,
        data: memo ? (`0x${Buffer.from(memo, "utf8").toString("hex")}` as `0x${string}`) : undefined,
        gas: await estimateGas(this.config, {
          account: this.connectedWallet as `0x${string}`,
          to: address as `0x${string}`,
          value,
          data: memo ? (`0x${Buffer.from(memo, "utf8").toString("hex")}` as `0x${string}`) : undefined,
        }),
      }

      const result = await sendTransaction(this.config, transaction)

      console.log("TXID:", result)
      
      return {
        success: true,
        txid: result,
        walletAddress: this.connectedWallet,
      }
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        console.error("Error sending payment", ex)
        return { success: false, error: ex.message }
      }
      return { success: false, error: "Error sending payment" }
    }
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
    function numHex(num: number) {
      return `0x${num.toString(16)}`
    }
    console.log(`Sending ${amount} ${token} token to ${address}...`)
    const gasPrice = await this.getGasPrice() //numHex(20000000000)
    if (!gasPrice) {
      console.error("Payment error: Error getting gas price")
      return { success: false, error: "Error getting gas price" }
    }
    console.log("GAS", Number.parseInt(gasPrice), gasPrice)
    const gas = numHex(210000)
    const wei = numHex(amount * 10 ** 6) // usdc and usdt only have 6 decs
    const method = "eth_sendTransaction"
    if (!this.web3) {
      console.error("Payment error: Error getting web3 instance")
      return { success: false, error: "Error getting web3 instance" }
    }
    const ctr = new this.web3.eth.Contract(erc20abi, contract)
    const data = ctr.methods.transfer(address, wei).encodeABI()
    console.log("Data", data)
    //const count = await this.web3.eth.getTransactionCount(this.connectedWallet)
    //const nonce = this.web3.utils.toHex(count)
    const tx = {
      from: this.connectedWallet,
      to: contract,
      value: "0x0",
      gasPrice,
      gas,
      data,
    }
    //if(memo){ tx.data = strHex(memo) }
    const params = [tx]
    console.log("TX", params)
    try {
      if (!this.metamask) {
        console.error("Error sending payment, Metamask not available")
        return {
          success: false,
          error: "Metamask not available",
        }
      }
      const result = await this.metamask.request({ method, params })
      console.log("TXID", result)
      if (typeof result !== "string") {
        return { success: false, error: "No transaction ID" }
      }
      return {
        success: true,
        txid: result,
        walletAddress: this.connectedWallet,
      }
    } catch (ex) {
      if (ex instanceof Error) {
        console.error("Error sending payment", ex)
        return { success: false, error: ex.message }
      }
      console.error(ex)
      return { success: false, error: "Error sending payment" }
    }
  }

  async fetchLedger(method: unknown, params: unknown): Promise<unknown> {
    const data = { id: "1", jsonrpc: "2.0", method, params }
    const body = JSON.stringify(data)
    const opt = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }
    try {
      const res = await fetch(this.network.rpcUrls.main, opt)
      const inf = await res.json()
      return inf?.result
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        return { error: ex.message }
      }
      return { error: "Error fetching from ledger" }
    }
  }
}

/*
function onWallet() {
  console.log('On wallet');
  if(this.metamask.isConnected()) {
    console.log('Logout');
    this.metamask.enable(); // ???
  } else {
    console.log('Enable');
    this.metamask.enable();
  }
}

async function calcGas(numx, web) {
  let gas = { gasPrice: 20000000000, gasLimit: 25000 };
  let prc = 20000000000;
  if(web){ prc = await web.eth.getGasPrice(); console.log('Gas Price', prc); }
  let est = parseInt(numx, 16);
  let lmt = parseInt(est * 1.15);
  gas.gasPrice = parseInt(prc);
  gas.gasLimit = lmt;
  console.log(gas);
  return gas;
}
*/

// END
