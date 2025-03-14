/// <reference path="./metamask.d.ts" />

import { chainConfig } from "@cfce/app-config"
import { chainAtom } from "@cfce/state"
import type {
  ChainSlugs,
  Network,
  NetworkConfig,
  TokenTickerSymbol,
} from "@cfce/types"
import type { MetaMaskInpageProvider } from "@metamask/providers"
import {
  http,
  connect,
  createConfig,
  estimateGas,
  getAccount,
  getBalance,
  injected,
  sendTransaction,
} from "@wagmi/core"
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  eos,
  eosTestnet,
  filecoin,
  filecoinCalibration,
  flare,
  flareTestnet,
  goerli, //ETH
  mainnet, // ETH
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  sepolia, // ETH
  xdc,
  xdcTestnet,
} from "@wagmi/core/chains"
import { getDefaultStore } from "jotai"
import { erc20Abi } from "viem"
import { formatUnits, parseEther } from "viem"
import Web3 from "web3"
import type {
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from "web3"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import {
  getChainByChainId,
  getChainConfigBySlug,
  getNetworkForChain,
} from "../chains/utils"
import type { Transaction } from "../types/transaction"

function stringToHex(str?: string) {
  return str
    ? (`0x${Buffer.from(str, "utf8").toString("hex")}` as `0x${string}`)
    : undefined
}

export default class MetaMaskWallet extends InterfaceBaseClass {
  listenersSet = false
  setChain(slug: ChainSlugs) {
    this.chain = chainConfig[slug]
    this.network = getNetworkForChain(slug)
    this.web3 = new Web3(this.network?.rpcUrls?.default)
  }
  connectedWallet? = ""
  wallets?: string[]
  metamask?: MetaMaskInpageProvider
  config: ReturnType<typeof createConfig> = createConfig({
    chains: [
      arbitrum,
      arbitrumSepolia,
      avalancheFuji,
      avalanche,
      base,
      baseSepolia,
      bsc,
      bscTestnet,
      celo,
      celoAlfajores,
      eos,
      eosTestnet,
      filecoin,
      filecoinCalibration,
      flare,
      flareTestnet,
      goerli,
      mainnet,
      optimism,
      optimismSepolia,
      polygon,
      polygonMumbai,
      sepolia,
      xdc,
      xdcTestnet,
    ],
    transports: {
      [arbitrum.id]: http(
        chainConfig.arbitrum.networks.mainnet.rpcUrls.default,
      ),
      [arbitrumSepolia.id]: http(
        chainConfig.arbitrum.networks.testnet.rpcUrls.default,
      ),
      [avalancheFuji.id]: http(
        chainConfig.avalanche.networks.testnet.rpcUrls.default,
      ),
      [avalanche.id]: http(
        chainConfig.avalanche.networks.mainnet.rpcUrls.default,
      ),
      [base.id]: http(chainConfig.base.networks.mainnet.rpcUrls.default),
      [baseSepolia.id]: http(chainConfig.base.networks.testnet.rpcUrls.default),
      [bsc.id]: http(chainConfig.binance.networks.mainnet.rpcUrls.default),
      [bscTestnet.id]: http(
        chainConfig.binance.networks.testnet.rpcUrls.default,
      ),
      [celo.id]: http(chainConfig.celo.networks.mainnet.rpcUrls.default),
      [celoAlfajores.id]: http(
        chainConfig.celo.networks.testnet.rpcUrls.default,
      ),
      [eos.id]: http(chainConfig.eos.networks.mainnet.rpcUrls.default),
      [eosTestnet.id]: http(chainConfig.eos.networks.testnet.rpcUrls.default),
      [filecoin.id]: http(
        chainConfig.filecoin.networks.mainnet.rpcUrls.default,
      ),
      [filecoinCalibration.id]: http(
        chainConfig.filecoin.networks.testnet.rpcUrls.default,
      ),
      [flare.id]: http(chainConfig.flare.networks.mainnet.rpcUrls.default),
      [flareTestnet.id]: http(
        chainConfig.flare.networks.testnet.rpcUrls.default,
      ),
      [goerli.id]: http(chainConfig.ethereum.networks.testnet.rpcUrls.default),
      [mainnet.id]: http(chainConfig.ethereum.networks.mainnet.rpcUrls.default),
      [optimism.id]: http(
        chainConfig.optimism.networks.mainnet.rpcUrls.default,
      ),
      [optimismSepolia.id]: http(
        chainConfig.optimism.networks.testnet.rpcUrls.default,
      ),
      [polygon.id]: http(chainConfig.polygon.networks.mainnet.rpcUrls.default),
      [polygonMumbai.id]: http(
        chainConfig.polygon.networks.testnet.rpcUrls.default,
      ),
      [sepolia.id]: http(chainConfig.ethereum.networks.testnet.rpcUrls.default),
      [xdc.id]: http(chainConfig.xdc.networks.mainnet.rpcUrls.default),
      [xdcTestnet.id]: http(chainConfig.xdc.networks.testnet.rpcUrls.default),
    },
  })

  async connect(chainSlug?: ChainSlugs) {
    console.log("Wallet starting...", chainSlug)
    let chain = chainSlug
    this.metamask = window.ethereum
    this.wallets = await this.metamask?.enable()
    try {
      if (!chain) {
        const metamaskChainId = window.ethereum?.chainId
        if (!metamaskChainId) {
          throw new Error("No chain ID provided or inferred")
        }
        chain = getChainByChainId(Number(metamaskChainId)).slug
      }

      this.setNetwork(chain)

      console.log("Connecting to chain", this.network?.id)
      const connection = await connect(this.config, {
        connector: injected(),
        chainId: this.network?.id,
      })
      this.connectedWallet = connection.accounts[0]
      console.log("MM Wallet", this.connectedWallet)

      if (!this.network) {
        throw new Error("Error getting network")
      }
      if (!this.chain) {
        throw new Error("Error getting chain")
      }

      if (!this.connectedWallet) {
        throw new Error("Error getting wallet")
      }

      this.web3 = new Web3(this.network.rpcUrls.default)
      return {
        success: true,
        network: this.network,
        walletAddress: this.connectedWallet,
        chain: this.chain.name,
      }
    } catch (ex) {
      const error = ex instanceof Error ? ex.message : ""
      console.error("Error", error)
      return { success: false, error }
    }
  }

  /**
   * Simple check if an address is valid, supporting both 0x and xdc formats
   */
  isValidAddress(address?: string): boolean {
    if (!address) return false

    // Standard Ethereum address: 0x + 40 hex chars = 42 chars
    const isEthAddress = address.startsWith("0x") && address.length === 42

    // XDC addresses: xdc + 40 hex chars = 43 chars
    const isXdcAddress = address.startsWith("xdc") && address.length === 43

    return isEthAddress || isXdcAddress
  }

  isConnected(): boolean {
    if (window.ethereum) {
      return (
        window.ethereum.isConnected() &&
        typeof this.chain !== "undefined" &&
        typeof this.network !== "undefined" &&
        this.isValidAddress(this.connectedWallet)
      )
    }
    return false
  }

  async verifyConnection(requiredChainSlug?: ChainSlugs): Promise<boolean> {
    // Check basic connection
    if (!this.isConnected()) {
      console.log("Wallet not connected, attempting to reconnect...")
      const connectResult = await this.connect(requiredChainSlug)
      return connectResult.success
    }

    // Verify chain if specified
    if (requiredChainSlug && this.network?.slug !== requiredChainSlug) {
      console.log("Chain mismatch, switching networks...")
      const networkResult = await this.setNetwork(requiredChainSlug)
      return networkResult !== false
    }

    // Verify we can actually get the account from the provider
    try {
      const account = await getAccount(this.config)
      if (account.address !== this.connectedWallet) {
        console.log("Wallet address mismatch, reconnecting...")
        const connectResult = await this.connect(requiredChainSlug)
        return connectResult.success
      }
      return true
    } catch (error) {
      console.error("Error verifying wallet connection:", error)
      return false
    }
  }

  setListeners() {
    if (this.listenersSet) {
      return
    }
    this.listenersSet = true

    console.log("LISTENERS")
    if (!this.metamask) {
      console.error("listeners: Metamask not available")
      return
    }
    if (!this.network) {
      console.error("listeners: Network not set, connect or setChain first")
      return
    }
    // @ts-expect-error returns chain ID string
    this.metamask.on("connect", (info: ProviderConnectInfo) => {
      console.log("> onConnect", Number.parseInt(info.chainId), info.chainId)
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
      if (Number(chainId) === this.network?.id) {
        console.log("Already on chain", chainId)
        return
      }
      const chain = getChainByChainId(Number(chainId))
      // this won't loop because we check for listenersSet
      this.setNetwork(chain.slug)
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

  async changeNetwork(provider: NetworkConfig) {
    if (!this.metamask) {
      console.error("Change network failed, Metamask not available")
      return false
    }
    console.log("Metamask changing network to", provider.name, provider.id)
    const chainHex = this.toHex(`${provider.id}`)
    try {
      await this.metamask.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      })

      // Wait for the chain to actually change
      return new Promise<boolean>((resolve) => {
        const checkChain = () => {
          const currentChainId = Number(this.metamask?.chainId || "0")
          if (currentChainId === provider.id) {
            resolve(true)
          } else {
            // Check again after a short delay
            setTimeout(checkChain, 500)
          }
        }
        checkChain()
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
                rpcUrls: [provider.rpcUrls.default],
                blockExplorerUrls: [provider.explorer.url],
              },
            ],
          })
          console.log("Network added!")

          // Wait for the chain to be added and switched to
          return new Promise<boolean>((resolve) => {
            const checkChain = () => {
              const currentChainId = Number(this.metamask?.chainId || "0")
              if (currentChainId === provider.id) {
                resolve(true)
              } else {
                // Check again after a short delay
                setTimeout(checkChain, 500)
              }
            }
            checkChain()
          })
        } catch (ex) {
          console.error("Metamask error adding network", ex)
          return false
        }
      }
      return false
    }
  }

  async setNetwork(chainSlug: ChainSlugs) {
    console.log("SetNetwork", chainSlug)
    this.chain = getChainConfigBySlug(chainSlug)
    // only change network if it's not already the correct network
    if (this.network?.slug !== chainSlug) {
      this.network = getNetworkForChain(chainSlug)
      const success = await this.changeNetwork(this.network)
      if (!success) {
        console.error("Failed to change network to", chainSlug)
        return false
      }
    }
    this.setListeners()
    if (!this.chain || !this.network) {
      console.error("Couldn't set network or chain for", chainSlug)
      return false
    }
    return true
  }

  // async getAccounts() {
  //   console.log("Get accounts...")
  //   if (!this.metamask) {
  //     console.error("Error getting accounts, Metamask not available")
  //     return
  //   }
  //   try {
  //     let [accounts, chainId] = await Promise.allSettled([
  //       this.metamask.request<string[]>({
  //         method: "eth_requestAccounts",
  //       }),
  //       this.metamask.request<string>({
  //         method: "eth_chainId",
  //       }),
  //     ])
  //     if (accounts?.status !== "fulfilled") {
  //       throw new Error("Error getting accounts")
  //     }
  //     if (chainId?.status !== "fulfilled") {
  //       throw new Error("Error getting chainId")
  //     }
  //     this.setNetwork(Number(chainId.value))
  //     if (accounts?.value?.length) {
  //       this.wallets = (accounts.value ?? []) as string[]
  //       this.connectedWallet = accounts.value[0] ?? ""
  //       console.log("Accounts:", accounts.value)
  //       console.log("MyAccount:", this.connectedWallet)
  //       //onReady(this.connectedWallet, this.network)
  //     }
  //   } catch (err) {
  //     console.log("Error: User rejected")
  //     console.error(err)
  //     //onReady(null, 'User rejected connection'
  //   }
  // }

  // async getAddress(): Promise<string | null> {
  //   console.log("Get address...")
  //   if (!this.metamask) {
  //     console.error("Error getting address, Metamask not available")
  //     return null
  //   }
  //   try {
  //     const accounts = await this.metamask.request<string[]>({
  //       method: "eth_requestAccounts",
  //     })
  //     console.log("Account", accounts)
  //     if (!accounts) {
  //       console.error("Error getting address, Metamask not available")
  //       return null
  //     }
  //     this.connectedWallet = accounts[0] ?? ""
  //     //$('user-address').innerHTML = this.connectedWallet.substr(0,10)
  //     return this.connectedWallet
  //   } catch (err) {
  //     console.log("Error: Wallet not connected", err)
  //     //$('user-address').innerHTML = 'Not connected'
  //     //$('user-balance').innerHTML = '0.0000 BNB'
  //     return null
  //   }
  // }

  async getBalance() {
    console.log("Get balance...")

    if (!this.metamask) {
      console.error("Error getting balance, Metamask not available")
      return { success: false, error: "Metamask not available" }
    }

    try {
      const balance = await getBalance(this.config, {
        address: this.connectedWallet as `0x${string}`,
        blockTag: "latest",
      })
      const balanceInETH = formatUnits(balance.value, balance.decimals)
      console.log("Balance", balanceInETH)

      console.log("Balance:", balance)
      console.log("BalanceInETH:", balanceInETH)

      if (!balance) {
        console.error("Error getting balance, no balance returned")
        return { success: false, error: "No balance returned" }
      }
      return { success: true, balance: Number(balanceInETH) }
    } catch (error) {
      console.error("Error getting balance", error)
      return { success: false, error: "Error getting balance" }
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

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo?: string }) {
    const { selectedChain } = getDefaultStore().get(chainAtom)
    console.log("CHAIN", selectedChain)

    // Verify connection and chain before proceeding
    const isConnected = await this.verifyConnection(selectedChain)
    if (!isConnected) {
      return {
        success: false,
        error:
          "Failed to establish a valid wallet connection on the correct network",
      }
    }

    console.log("METAMASK PAYMENT", address, amount, memo)

    function numHex(num: number) {
      return `0x${num.toString(16)}`
    }
    function strHex(str: string) {
      return `0x${Buffer.from(str.toString(), "utf8").toString("hex")}`
    }
    console.log(`Sending ${amount} to ${address}...`)

    try {
      if (!this.connectedWallet) {
        throw new Error("Wallet not connected", {
          cause: this.connectedWallet,
        })
      }

      // Check if the receiving address is valid
      if (!this.isValidAddress(address)) {
        throw new Error(`Invalid address format: ${address}`)
      }

      // Convert amount to wei using parseEther
      // const value = parseEther(amount.toString())
      const value = this.toBaseUnit(amount)
      console.log("VALUE", value)

      // Prepare transaction parameters
      const account = this.connectedWallet as `0x${string}`
      const to = address as `0x${string}`
      const data = stringToHex(memo)
      const preTx = { account, to, value, data }
      console.log("PRETX", preTx)
      console.log("CONFIG", this.config)

      // Use AbortController for gas estimation timeout
      const gasEstimationController = new AbortController()
      const gasEstimationTimeoutId = setTimeout(() => {
        gasEstimationController.abort("Gas estimation timed out")
      }, 15000)

      let estimated: bigint
      try {
        estimated = await estimateGas(this.config, {
          ...preTx,
          // Pass the signal if the method supports it
          // This depends on how estimateGas is implemented
        })
        clearTimeout(gasEstimationTimeoutId)
      } catch (error) {
        clearTimeout(gasEstimationTimeoutId)
        if (gasEstimationController.signal.aborted) {
          throw new Error("Gas estimation timed out")
        }
        throw error
      }

      console.log("EST", estimated)
      const gas = BigInt(Math.floor(Number(estimated) * 1.2)) // 20% just to be safe
      console.log("GAS", gas)

      const transaction = {
        account,
        to,
        value,
        data,
        gas,
        chainId: this.network?.id,
      }
      console.log("TX", transaction)

      // Use AbortController for transaction timeout
      const txController = new AbortController()
      const txTimeoutId = setTimeout(() => {
        txController.abort("Transaction sending timed out")
      }, 30000)

      let result: string
      try {
        result = await sendTransaction(this.config, {
          ...transaction,
          // Pass the signal if the method supports it
          // This depends on how sendTransaction is implemented
        })
        clearTimeout(txTimeoutId)
      } catch (error) {
        clearTimeout(txTimeoutId)
        if (txController.signal.aborted) {
          throw new Error("Transaction sending timed out")
        }
        throw error
      }

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
    const { selectedChain } = getDefaultStore().get(chainAtom)
    console.log("CHAIN", selectedChain)

    // Verify connection and chain before proceeding
    const isConnected = await this.verifyConnection(selectedChain)
    if (!isConnected) {
      return {
        success: false,
        error:
          "Failed to establish a valid wallet connection on the correct network",
      }
    }

    function numHex(num: number) {
      return `0x${num.toString(16)}`
    }
    console.log(`Sending ${amount} ${token} token to ${address}...`)

    // Check if the addresses are valid
    if (!this.isValidAddress(address)) {
      return {
        success: false,
        error: `Invalid recipient address format: ${address}`,
      }
    }

    if (!this.isValidAddress(contract)) {
      return {
        success: false,
        error: `Invalid contract address format: ${contract}`,
      }
    }

    // Get gas with abort controller for timeout
    let gasPrice: string | undefined
    const gasPriceController = new AbortController()
    const gasPriceTimeoutId = setTimeout(() => {
      gasPriceController.abort("Gas price retrieval timed out")
    }, 10000)

    try {
      // The getGasPrice method doesn't currently support AbortController
      // But we'll add the timeout cleanup
      gasPrice = await this.getGasPrice()
      clearTimeout(gasPriceTimeoutId)

      if (!gasPrice) {
        console.error("Payment error: Error getting gas price")
        return { success: false, error: "Error getting gas price" }
      }
    } catch (error) {
      clearTimeout(gasPriceTimeoutId)
      if (gasPriceController.signal.aborted) {
        return { success: false, error: "Gas price retrieval timed out" }
      }
      console.error("Error getting gas price:", error)
      return { success: false, error: "Failed to get gas price" }
    }

    console.log("GAS", Number.parseInt(gasPrice), gasPrice)
    const gas = numHex(210000)
    const wei = numHex(amount * 10 ** 6) // usdc and usdt only have 6 decs
    const method = "eth_sendTransaction"
    if (!this.web3) {
      console.error("Payment error: Error getting web3 instance")
      return { success: false, error: "Error getting web3 instance" }
    }
    const ctr = new this.web3.eth.Contract(erc20Abi, contract)
    const data = ctr.methods.transfer(address, wei).encodeABI()
    console.log("Data", data)

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

      // Use AbortController for transaction timeout
      const txController = new AbortController()
      const txTimeoutId = setTimeout(() => {
        txController.abort("Transaction sending timed out")
      }, 30000)

      let result: string | unknown
      try {
        // The metamask.request doesn't support AbortController yet
        // But we'll add the timeout cleanup
        result = await this.metamask.request({ method, params })
        clearTimeout(txTimeoutId)
      } catch (error) {
        clearTimeout(txTimeoutId)
        if (txController.signal.aborted) {
          throw new Error("Transaction sending timed out")
        }
        throw error
      }

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
    if (!this.network) {
      console.error("Network not set, connect or setChain first")
      return { success: false, error: "Network not set" }
    }
    const data = { id: "1", jsonrpc: "2.0", method, params }
    const body = JSON.stringify(data)
    const opt = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }
    try {
      const res = await fetch(this.network.rpcUrls.default, opt)
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

  async reconnect(
    chainSlug?: ChainSlugs,
    maxAttempts = 3,
  ): Promise<boolean | undefined> {
    let attempts = 0
    let success = false

    while (attempts < maxAttempts && !success) {
      try {
        console.log(`Reconnection attempt ${attempts + 1}/${maxAttempts}...`)
        const result = await this.connect(chainSlug)
        success = result.success

        if (success) {
          console.log("Reconnection successful")
          return true
        }

        // Exponential backoff
        const delay = Math.min(1000 * 2 ** attempts, 10000)
        console.log(`Reconnection failed. Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } catch (error) {
        console.error("Error during reconnection attempt:", error)
      }

      attempts++
    }

    if (!success) {
      console.error("Failed to reconnect after multiple attempts")
    }

    return success
  }
}

// END
