import {
  connect,
  disconnect,
  type Connector,
  type StarknetWindowObject,
} from "starknetkit"
// import { connect, type StarknetWindowObject } from "@starknet-io/get-starknet"
import {
  Account,
  constants,
  Contract,
  WalletAccount,
  type Provider,
  RpcProvider,
  TransactionFinalityStatus,
} from "starknet"
import type {
  GetTransactionReceiptResponse,
  Call,
  AccountInterface,
} from "starknet"
import {
  type GaslessOptions,
  SEPOLIA_BASE_URL,
  executeCalls,
  fetchGasTokenPrices,
} from "@avnu/gasless-sdk"
import appConfig from "@cfce/app-config"
import type {
  ChainConfig,
  ChainSlugs,
  Network,
  NetworkConfig,
} from "@cfce/types"
import { formatEther, parseEther } from "viem"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import chainConfiguration from "../chains/chainConfig"
import { getNetworkForChain } from "../chains/utils"
import { ERC20 } from "../contracts/starknet/ERC20Abi"
import { ERC721ABI } from "../contracts/starknet/ERC721Abi"

class StarknetWallet extends InterfaceBaseClass {
  provider: Provider
  account: AccountInterface | null = null
  contract: Contract | null = null
  wallet: StarknetWindowObject | null = null
  connectedWallet = ""
  connector: Connector | null = null
  decimals = 18
  network: NetworkConfig
  chain: ChainConfig

  constructor() {
    super()
    this.network = getNetworkForChain("starknet")
    this.chain = chainConfiguration.starknet

    this.provider = new RpcProvider({
      nodeUrl: this.network.rpcUrls.main,
    })

    this.contract = new Contract(
      ERC20,
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      this.provider,
    )
    //console.log("STARKNET INIT")
    //console.log("RPC provider", this.provider)
  }

  async init() {
    const starknet = await connect({
      modalMode: "alwaysAsk",
    })
    if (starknet) {
      return { success: true }
    }
    return { success: false }
  }

  async getWallet() {
    const { wallet, connector } = await connect({
      modalMode: "alwaysAsk",
    })

    const account = await connector?.account(this.provider)
    // const walletAccount = new WalletAccount(this.provider, starknet)
    // Get current chain from wallet
    const currentChain = await this.provider?.getChainId()
    console.log("Current chain", currentChain)

    const envChain = appConfig.chains.starknet?.network
    console.log("Env chain", envChain)

    // Determine target network based on environment
    const targetChainId =
      envChain === "mainnet"
        ? constants.StarknetChainId.SN_MAIN // Mainnet for production
        : constants.StarknetChainId.SN_SEPOLIA // Sepolia for development

    console.log("Target chain", targetChainId)

    // Switch network if needed
    if (currentChain !== targetChainId) {
      try {
        await wallet?.request({
          type: "wallet_switchStarknetChain",
          params: {
            chainId: targetChainId,
          },
        })
      } catch (error) {
        console.error("Failed to switch network:", error)
        throw new Error(
          `Please switch to ${envChain === "mainnet" ? "Mainnet" : "Sepolia"} network in your wallet`,
        )
      }
    }

    if (!account) {
      throw new Error("Account not found")
    }

    this.connectedWallet = account.address
    this.account = account

    if (!wallet) {
      throw new Error("Wallet not found")
    }

    this.wallet = wallet
    this.connector = connector
    return { wallet, connector }
  }

  async connect() {
    try {
      console.log("CONNECT...")

      await this.getWallet()

      if (this.connectedWallet) {
        return {
          success: true,
          walletAddress: this.connectedWallet,
          chain: this.chain.name,
          network: this.network,
        }
      }

      throw new Error("Failed to connect wallet")
    } catch (ex) {
      console.error(ex)
      return { success: false, error: ex instanceof Error ? ex.message : "" }
    }
  }

  public async sendPayment({ address, amount, memo }: { address: string; amount: number; memo?: string }) {
    try {
      if (!this.connector) {
        ({ connector: this.connector } = await this.getWallet())
      }

      // const account = await this.connector?.account(this.provider)
      const account = this.wallet
      if (!account) {
        throw new Error("No account found")
      }

      const walletAccount = new WalletAccount(this.provider, this.wallet as StarknetWindowObject)
      const calls = this.prepareTransferCall(address, amount)
      const result = await walletAccount.execute(calls)
      const tx = result.transaction_hash

      const txResult = await this.provider.waitForTransaction(tx, {
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      })

      if (txResult.statusReceipt === "success") {
        return {
          success: true,
          txid: tx,
          walletAddress: this.connectedWallet,
        }
      }

      return {
        success: false,
        error: "Transaction failed",
        txid: tx,
      }
    } catch (gasErr) {
      console.error("Error executing gas transaction", gasErr)
      return {
        success: false,
        error:
          gasErr instanceof Error
            ? gasErr.message
            : "Failed to execute gas transaction",
      }
    }
  }

  private prepareTransferCall(address: string, amount: number): Call[] {
    const envChain = appConfig.chains.starknet?.network
    const smartContractAddress =
      envChain === "mainnet"
        ? "0x1a35e6a801710eddfa9071eb27e4fc702c81b1b609efb34d46d419035275a38"
        : "0x4ccddb06be7807276e88ebdd84319712aba3ba25c9e8cf3860b2891b07cd8b1"

    // Convert the amount considering decimals
    const amountWithDecimals = parseEther(amount.toString())
    const amountBigInt = BigInt(amountWithDecimals)

    // Split into low and high bits for u256 representation
    const low = amountBigInt & BigInt("0xffffffffffffffffffffffffffffffff")
    const high = amountBigInt >> BigInt(128)

    return [
      {
        entrypoint: "approve",
        contractAddress:
          "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        calldata: [
          smartContractAddress,
          low.toString(), // low bits
          high.toString(), // high bits
        ],
      },
      {
        entrypoint: "donate",
        contractAddress: smartContractAddress,
        calldata: [low.toString(), high.toString()],
      },
    ]
  }

  async sendGaslessPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo: string }) {
    try {
      // Check if API keys are available
      if (
        !process.env.NEXT_PUBLIC_AVNU_PUBLIC_KEY ||
        !process.env.NEXT_PUBLIC_AVNU_KEY
      ) {
        throw new Error("No API keys found")
      }

      let connector = this.connector
      if (!connector) {
        ({ connector } = await this.getWallet())
      }

      const account = new WalletAccount(this.provider, this.wallet as StarknetWindowObject)
      console.log("Account", account)
      console.log("Account connected")

      const calls = this.prepareTransferCall(address, amount)

      const options: GaslessOptions = {
        baseUrl: SEPOLIA_BASE_URL,
        apiPublicKey: process.env.NEXT_PUBLIC_AVNU_PUBLIC_KEY,
        apiKey: process.env.NEXT_PUBLIC_AVNU_KEY,
      }

      const gasTokenPrice = await fetchGasTokenPrices(options)
      console.log("GasTokenPrice", gasTokenPrice)

      if (!account) {
        throw new Error("Account not found")
      }

      let txid: string
      try {
        // First attempt: gasless transaction
        txid = (await executeCalls(account, calls, {}, options)).transactionHash
      } catch (err) {
        console.error("Error executing gasless calls", err)
        throw new Error("Failed to execute gasless transaction")
      }

      console.log("TX", txid)
      const tx = txid

      if (!tx) {
        throw new Error("Transaction hash not found")
      }

      const result = await this.provider.waitForTransaction(tx, {
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      })

      if (result.statusReceipt === "success") {
        return {
          success: true,
          txid: tx,
          walletAddress: this.connectedWallet,
        }
      }

      return {
        success: false,
        error: "Transaction failed",
        txid: tx,
      }
    } catch (err) {
      console.error("E>>", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }
    }
  }

  async getTransactionInfo(txid: string) {
    try {
      console.log("Get tx info by txid", txid)
      const txInfo = await this.provider.waitForTransaction(txid, {
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      })
      const txReceipt: GetTransactionReceiptResponse =
        await this.provider.getTransactionReceipt(txid)

      if (!txInfo || !txReceipt) {
        console.log("ERROR", "Transaction not found:", txid)
        return { error: "Transaction not found" }
      }

      const result = {
        id: txid,
        hash: txid,
        from: txid,
        to: txid,
        value: txid,
        fee: txid,
        timestamp: new Date().toISOString(),
        blockNumber: Math.floor(Date.now() / 1000),
      }
      return result
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return { error: error.message }
      }
      return { error: "Unknown error" }
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

  async mintNFT({
    address,
    uri,
    contractId,
    walletSeed,
  }: {
    address: string
    uri: string
    contractId: string
    walletSeed: string
  }) {
    console.log(this.chain, "server minting NFT to", address, uri)

    try {
      const provider = this.provider

      const minterAddress = appConfig.chains.starknet?.contracts.receiptMintbotERC721
      if (!minterAddress || !walletSeed) {
        throw new Error("Minter address or wallet seed not available")
      }

      const account = new Account(provider, minterAddress, walletSeed)
      console.log("Account", account)
      const contractABI = (await provider.getClassAt(contractId)).abi;

      const contract = new Contract(contractABI, contractId, provider)
      // Generate unique token ID
      // const tokenId = 1;
      // const call = {
      //   entrypoint: "safeMint",
      //   contractAddress: contractId,
      //   calldata: [address, uri],
      // }
      console.log("Contract Function", contract.functions)
      const call = contract.populate("safeMint", {
        recipient: address,
        data: uri,
      })
      const mintTx = await account.execute(call)
      // const mintTx = await contract.functions
      // console.log("MINT TX", mintTx);
      const receipt = await provider.waitForTransaction(
        mintTx.transaction_hash,
        {
          successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
        },
      )
      const events = contract.parseEvents(receipt)

      // Find the Transfer event from the NFT contract
      const transferEvent =
        events[0][
          "openzeppelin_token::erc721::erc721::ERC721Component::Transfer"
        ]
      const tokenId = Number(transferEvent.token_id).toString()

      if (receipt.isSuccess()) {
        return {
          success: true,
          txId: mintTx.transaction_hash,
          tokenId: tokenId,
        }
      }

      return { success: false, error: "Transaction failed" }
    } catch (error) {
      console.error("Mint error:", error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during minting",
      }
    }
  }

  async getBalance() {
    try {
      if (!this.connectedWallet) {
        await this.getWallet()
      }
      const balance = await this.contract?.balanceOf(this.connectedWallet)
      console.log("Balance", balance)
      const {
        balance: { low },
      } = balance
      console.log("Balance low", low)
      return { success: true, balance: low }
    } catch (error) {
      console.error("Error getting balance", error)
      return { success: false, error: "Error getting balance" }
    }
  }
}

export default StarknetWallet