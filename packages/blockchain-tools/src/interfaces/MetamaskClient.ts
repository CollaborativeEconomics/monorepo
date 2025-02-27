/// <reference path="./metamask.d.ts" />

import { chainConfig } from "@cfce/app-config"
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
  getBalance,
  sendTransaction,
} from "@wagmi/core"
import { injected } from "@wagmi/core"
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
import { erc20Abi } from "viem"
import { formatUnits, parseEther } from "viem"
import Web3 from "web3"
import type {
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from "web3"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import { getChainByChainId, getNetworkForChain } from "../chains/utils"
import type { Transaction } from "../types/transaction"

function stringToHex(str?: string) {
  return str
    ? (`0x${Buffer.from(str, "utf8").toString("hex")}` as `0x${string}`)
    : undefined
}

export default class MetaMaskWallet extends InterfaceBaseClass {
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

  async connect(newChainId?: number) {
    console.log("Wallet starting...", newChainId)
    //console.log('window.ethereum')
    try {
      this.metamask = window.ethereum
      this.wallets = await this.metamask?.enable()
      const metamaskChainId = window.ethereum?.chainId
      console.log("MM Chain ID", metamaskChainId)

      // TODO: Assign config based on chainId <<<<
      //const currentId = newChainId || 0
      //const currentChain = chains[currentId] || null
      //this.config = createConfig({
      //  chains: [currentChain],
      //  transports: {
      //    [currentId]: http(this.network?.rpcUrls?.default)
      //  }
      //})
      //console.log("CONFIG", this.config)

      const connection = await connect(this.config, { connector: injected() })
      this.connectedWallet = connection.accounts[0]
      console.log("MM Wallet", this.connectedWallet)
      const newChainIsSameAsConnectedChain =
        Number(newChainId) === Number(this.network?.id)
      const metamaskChainIsSameAsConnectedChain =
        Number(metamaskChainId) === Number(this.network?.id)
      // early return if chainId and wallet are already set correctly
      console.log(
        "newChainIsSameAsConnectedChain",
        newChainIsSameAsConnectedChain,
        newChainId,
        this.network?.id,
      )
      console.log(
        "metamaskChainIsSameAsConnectedChain",
        metamaskChainIsSameAsConnectedChain,
        metamaskChainId,
        this.network?.id,
      )
      console.log("this.network", this.network)

      if (
        typeof newChainId === "undefined" &&
        typeof metamaskChainId === "undefined"
      ) {
        throw new Error("No chain ID provided or inferred")
      }
      const chainId = newChainId ?? Number(metamaskChainId)
      console.log("MM Chain ID", chainId)

      if (typeof chainId !== "number") {
        throw new Error(`Invalid chain ID type: ${typeof chainId}`)
      }

      this.setNetwork(chainId)

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

  isConnected() {
    if (window.ethereum) {
      return (
        window.ethereum.isConnected() &&
        typeof this.chain !== "undefined" &&
        typeof this.network !== "undefined"
      )
    }
    return false
  }

  setListeners() {
    console.log("LISTENERS", this)
    if (!this.metamask) {
      console.error("Metamask not available")
      return
    }
    if (!this.network) {
      console.error("Network not set, connect or setChain first")
      return
    }
    // @ts-expect-error returns chain ID string
    this.metamask.on("connect", (info: ProviderConnectInfo) => {
      console.log("> onConnect", Number.parseInt(info.chainId), info.chainId)
      this.setNetwork(Number(info.chainId))
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
      this.setNetwork(Number(chainId))
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

  setNetwork(chainId: number) {
    console.log("SetNetwork", chainId)
    this.chain = getChainByChainId(chainId)
    this.network = getNetworkForChain(this.chain.slug)
    this.changeNetwork(this.network)
    this.setListeners()
    if (!this.chain || !this.network) {
      console.error("Couldn't set network or chain for", chainId)
      return
    }
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
                rpcUrls: [provider.rpcUrls.default],
                blockExplorerUrls: [provider.explorer.url],
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
    console.log("METAMASK PAYMENT", address, amount, memo)
    if (!this.network) {
      console.error("Network not set, connect or setChain first")
      return { success: false, error: "Network not set" }
    }
    function numHex(num: number) {
      return `0x${num.toString(16)}`
    }
    function strHex(str: string) {
      return `0x${Buffer.from(str.toString(), "utf8").toString("hex")}`
    }
    console.log(`Sending ${amount} to ${address}...`)

    try {
      if (!this.connectedWallet) {
        throw new Error("Wallet not connected")
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
      const estimated = await estimateGas(this.config, preTx)
      console.log("EST", estimated)
      const gas = BigInt(Number(estimated) * 1.2) // 20% just to be safe
      console.log("GAS", gas)
      const transaction = { account, to, value, data, gas }
      console.log("TX", transaction)
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
