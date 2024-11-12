import type { ChainSlugs, Network } from "@cfce/types"
import { connect, disconnect, type Connector, type StarknetWindowObject } from "starknetkit"
import {Account, constants, Contract, num, Provider, RpcProvider } from "starknet"
import type { GetTransactionReceiptResponse, Call, AccountInterface } from "starknet"
import {
  executeCalls,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGasTokenPrices,
  type GaslessCompatibility,
  type GaslessOptions,
  type GasTokenPrice,
  type PaymasterReward,
  SEPOLIA_BASE_URL,
  type ExecuteCallsOptions,
  fetchGaslessStatus,
  type DeploymentData,
} from '@avnu/gasless-sdk'
import ChainBaseClass from "../chains/ChainBaseClass"
import { parseEther, formatEther } from "viem"
import { ERC20 } from "../contracts/starknet/Abi"
import { nftABI } from "../contracts/starknet/nftABI"

class StarknetWallet extends ChainBaseClass {
  provider: Provider
  account: AccountInterface | null = null
  contract: Contract | null = null
  wallet: StarknetWindowObject | null = null
  connectedWallet = ""
  connector: Connector | null = null
  decimals = 18

  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    this.provider = new Provider({
      nodeUrl: process.env.STARKNET_RPC_URI
    })

    this.contract = new Contract(ERC20, "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d", this.provider)
    console.log("STARKNET INIT")
    console.log("RPC provider", this.provider)
  }

  async init() {
    const starknet = await connect({
        modalMode: "alwaysAsk"
    })
    if (starknet?.wallet) {
      return { success: true }
    }
    return { success: false }
  }

  async getWallet() {
    const {wallet, connector} = await connect({
      modalMode: "alwaysAsk"
    })

    const account = await connector?.account()

    this.connectedWallet = account.address
    this.account = account

    if (!wallet) {
      throw new Error("Wallet not found")
    }

    this.wallet = wallet
    this.connector = connector
    return {wallet, connector}
  }

  async connect() {
    try {
      console.log("CONNECT...")

      let wallet = this.wallet

      if (!wallet) {
        ({wallet} = await this.getWallet())
      }
      
      if (wallet?.isConnected) {
        
        return {
          success: true,
          walletAddress: this.connectedWallet,
          network: this.network.slug,
        }
      }
      throw new Error("Failed to connect wallet")
    } catch (ex) {
      console.error(ex)
      return { success: false, error: ex instanceof Error ? ex.message : "" }
    }
  }

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo: string }) {
    try {

      let connector = this.connector

      if (!connector) {
        ({connector} = await this.getWallet())
      }


      const account = await connector?.account()
      console.log("Account", account)
      console.log("Account connected", )
      const contractId = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
  
      const weihex = `0x${amount.toString(16)}`;

      const options: GaslessOptions = {
        baseUrl: SEPOLIA_BASE_URL,
        apiPublicKey: process.env.NEXT_PUBLIC_AVNU_PUBLIC_KEY,
        apiKey: process.env.NEXT_PUBLIC_AVNU_KEY,
      };

      const gasTokenPrice = await fetchGasTokenPrices(options);
      console.log('GasTokenPrice', gasTokenPrice);

      const calls: Call[] = [
        {
          entrypoint: 'transfer',
          // entrypoint: 'donate',
          contractAddress: contractId,
          calldata: [address, weihex, '0x0'],
          // calldata: [weihex],
        },
      ];

      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let txid;
      try {
        txid = await executeCalls(account, calls, {}, options);
      } catch (err) {
        console.error("Error executing calls", err);
      }

      console.log("TX", txid);
      const tx = txid?.transactionHash;

      if (!tx) {
        throw new Error("Transaction hash not found")
      }

      const result = await this.provider.waitForTransaction(tx)

      if (result.isSuccess()) {
        return {
          success: true,
          result,
          txid: tx,
          walletAddress: this.connectedWallet,
        }
      }

      return {
        success: false,
        error: "Transaction failed",
        result,
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
      const txInfo = await this.provider.waitForTransaction(txid)
      const txReceipt: GetTransactionReceiptResponse = await this.provider.getTransactionReceipt(txid)

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
  walletSeed
}: {
  address: string;
  uri: string;
  contractId: string;
  walletSeed: string;
}) {
  console.log(this.chain, "server minting NFT to", address, uri);
  
  try {
    const provider = new RpcProvider({
      nodeUrl: process.env.STARKNET_RPC_URI || ''
    });
    
    const minterAddress = process.env.STARKNET_MINTER_ADDRESS;
    if (!minterAddress || !walletSeed) {
      throw new Error("Minter address or wallet seed not available");
    }
    
    const account = new Account(provider, minterAddress, walletSeed);
    
    const contract = new Contract(nftABI, contractId, provider);
    contract.connect(account);
    
    // Generate unique token ID
    const tokenId = Math.floor(Math.random() * 1e16);
    
    const mintTx = await contract.safe_mint(address, tokenId, uri);
    const receipt = await provider.waitForTransaction(mintTx.transaction_hash);
    console.log("Receipt", receipt)
    
    if (receipt.isSuccess()) {
      return {
        success: true,
        txId: mintTx.transaction_hash,
        tokenId: tokenId.toString()
      };
    }
    
    return { success: false, error: "Transaction failed" };
  } catch (error) {
    console.error("Mint error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error during minting" 
    };
  }
}

  async getBalance() {
    if (!this.connectedWallet) {
      await this.getWallet();
    }

    const balance = await this.contract?.balanceOf(this.connectedWallet)
    console.log("Balance", balance)
    const { balance: { low } } = balance
    console.log("Balance low", low)
    return low
  }
}

export default StarknetWallet

function randomNumber(arg0: number) {
  throw new Error("Function not implemented.")
}
