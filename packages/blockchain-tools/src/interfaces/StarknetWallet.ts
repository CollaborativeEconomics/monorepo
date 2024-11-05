import type { ChainSlugs, Network } from "@cfce/types"
import { connect, disconnect, Connector } from "starknetkit"
import { RpcProvider, Account, constants, Contract, num } from "starknet"
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

class StarknetWallet extends ChainBaseClass {
  provider: RpcProvider
  account: Account | null = null
  connectedWallet = ""
  decimals = 18

  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    this.provider = new RpcProvider({
      nodeUrl: process.env.STARKNET_RPC_URI
    })
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
    const wallet = await connect({
      modalMode: "alwaysAsk"
    })
    return wallet
  }

  async connect() {
    try {
      console.log("CONNECT...")
      const wallet = await this.getWallet()
      
      if (wallet?.connector?.account && wallet?.connector) {
        this.connectedWallet = (await wallet.connector.account(this.provider)).address
        this.account = new Account(
          this.provider,
          (await wallet.connector.account(this.provider)).address,
          (await wallet.connector.account(this.provider)).signer
        )
        
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
      const starknet = await this.getWallet()
      if (!starknet?.wallet) {
        throw new Error("Wallet not connected")
      }


      const account = await starknet.connector?.account(this.provider)
      console.log("Account", account)
      console.log("Account connected", )
      const contractId = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
      // const contract = new Contract(ERC20, num.toHex(contractId), account)
      console.log("Amount", amount)
      // console.log("Contract", contract)
      console.log("Address", address)

      // const TxCall = contract.populate('transfer', {
      //   recipient: address,
      //   amount: num.toHex(amount),
      // })

      // let response;
      // try {
      //   // response = await contract.transfer(address, {
      //   //   low: num.toHex(amount),
      //   //   high: 0,
      //   // });
      //   response = await account.execute(TxCall)
      // } catch (error) {
      //   console.error("Error transferring tokens:", error);
      //   throw error;
      // }
      // console.log("Amount before conversion:", amount);
      // const amountEth = formatEther(BigInt(amount));
      // console.log("Amount in Wei:", amountEth.toString());
      // const amountWei = parseEther(amountEth.toString())
      // console.log("Amount in Wei:", amountWei);
      // const weihex = `0x${amountWei.toString(16)}`
      // console.log("Amount in Hex:", weihex);
      
      // console.log("Creating calls array with:", {
      //   address,
      //   weihex
      // });

      // const calls: Call[] = [{
      //   entrypoint: 'transfer',
      //   contractAddress: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
      //   calldata: [address, weihex, '0x0'],
      // }];

      // console.log("Calls array created:", calls);

      // // biome-ignore lint/style/noNonNullAssertion: <explanation>
      // const account = (await wallet?.connector?.account(this.provider))!;
      // console.log("Account retrieved:", account);

      // const options: GaslessOptions = {
      //   baseUrl: SEPOLIA_BASE_URL,
      //   apiPublicKey: process.env.NEXT_PUBLIC_AVNU_PUBLIC_KEY,
      //   apiKey: process.env.NEXT_PUBLIC_AVNU_KEY,
      // };

      // console.log("About to execute calls with options:", options);
      // const tx = (
      //   await executeCalls(
      //     account,
      //     calls,
      //     {
      //       gasTokenAddress: undefined,
      //       maxGasTokenAmount: undefined,
      //     },
      //     options
      //   )
      // ).transactionHash;
      // console.log("Transaction hash:", tx);

      // const transferCall: Call = erc20.populate('transfer', {
      //   recipient: '0x78662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1',
      //   amount: 1n * 10n ** 18n,
      // })


        // Gasless Transaction
  
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
        console.log("Calls", calls)

        if (!account) {
          throw new Error("Account not found")
        }

        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let txid;
        try {
          txid = (
            await executeCalls(
            account,
            calls,
            {},
            options
            )
          );
      } catch (err) {
        console.error("Error executing calls", err)
      }
        
      console.log("TX", txid)
      const tx = txid?.transactionHash

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

async mintNFT(params: {
    address: string;
    uri: string;
    taxon?: number;
    transfer?: boolean;
    contractId: string;
    walletSeed: string;
  }) {
    console.log(
      'Minting NFT, wait...',
      params.address,
      params.uri,
      params.taxon,
      params.transfer,
      params.contractId,
      params.walletSeed
    );

    return { success: true };
  }
}



export default StarknetWallet