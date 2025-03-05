import { chainConfig } from "@cfce/app-config"
import type { ChainSlugs } from "@cfce/types"
import _get from "lodash/get"
import { http, createPublicClient, createWalletClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import Web3 from "web3"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import { getNetworkForChain } from "../chains/utils"
import Abi721inc from "../contracts/solidity/erc721/erc721inc-abi.json" // autoincrements tokenid
import Abi721tba from "../contracts/solidity/erc721/erc721tba-abi.json" // must pass tokenid and metadatauri
import Abi1155 from "../contracts/solidity/erc1155/erc1155-abi.json"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getObjectValue(obj: any, prop: string) {
  return prop.split(".").reduce((r, val) => {
    return r ? r[val] : undefined
  }, obj)
}

function bytesToHex(bytes: Uint8Array) {
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class Web3Server extends InterfaceBaseClass {
  setChain(slug: ChainSlugs) {
    this.chain = chainConfig[slug]
    this.network = getNetworkForChain(slug)
    this.web3 = new Web3(this.network.rpcUrls.default)
  }

  async getGasPrice(minter: string, contractId: string, data: string) {
    let gasPrice = await this.fetchLedger("eth_gasPrice", [])
    // FIX: gasPrice in XDC is not returning updated prices
    // Increment 20% to XDC gas price to avoid tx in limbo
    if (this.chain?.slug === "xdc") {
      console.log("OLD", Number.parseInt(gasPrice, 16), gasPrice)
      const newGas = Number.parseInt(gasPrice) * 1.2
      gasPrice = `0x${newGas.toString(16)}`
    }
    console.log("GAS", Number.parseInt(gasPrice, 16), gasPrice)
    const params = [{ from: minter, to: contractId, data }]
    let checkGas = await this.fetchLedger("eth_estimateGas", params)
    console.log("EST", Number.parseInt(checkGas, 16), checkGas)
    if (!checkGas) {
      checkGas = "0x1e8480" // 2000000
    }
    const gasLimit = `0x${Math.floor(Number.parseInt(checkGas, 16) * 1.2).toString(16)}` // add 20% just in case
    return { gasPrice, gasLimit }
  }

  // Autoincrementing NFT
  async mintNFT({
    uri,
    address,
    contractId,
    walletSeed,
  }: { uri: string; address: string; contractId: string; walletSeed: string }) {
    if (!this.chain) {
      console.error("Chain not set")
      return { success: false, error: "Chain not set" }
    }
    console.log("CHAIN", this.chain)
    console.log("Server minting NFT to", address, uri)
    if (!this.web3) {
      console.error("Web3 not available")
      return { success: false, error: "Web3 not available" }
    }
    if (!walletSeed) {
      console.error("Wallet not available")
      return { success: false, error: "Wallet not available" }
    }
    const acct = this.web3.eth.accounts.privateKeyToAccount(walletSeed)
    const minter = acct.address
    const instance = new this.web3.eth.Contract(Abi721inc, contractId)
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest")
    const nonce = Number(noncex)
    console.log("MINTER", minter)
    console.log("NONCE", nonce)
    const ABI = instance.methods
    const data = instance.methods.safeMint(address, uri).encodeABI()
    console.log("DATA", data)
    const gas = await this.getGasPrice(minter, contractId, data)
    console.log("GAS", gas)

    const account = privateKeyToAccount(walletSeed as `0x${string}`)

    const RPC_URL = this.network?.rpcUrls?.default
    console.log("RPC_URL", RPC_URL)

    const publicClient = createPublicClient({
      transport: http(RPC_URL),
    })

    const walletClient = createWalletClient({
      transport: http(RPC_URL),
    })

    try {
      const { request } = await publicClient.simulateContract({
        account,
        address: contractId as `0x${string}`,
        abi: Abi721inc,
        functionName: "safeMint",
        args: [address, uri],
      })

      const hash = await walletClient.writeContract(request)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === "success") {
        let tokenNum = ""
        if (receipt.logs?.length > 0) {
          console.log(
            "LOGS.0",
            JSON.stringify(receipt?.logs[0].topics, null, 2),
          )

          const nftSex = getObjectValue(receipt, "logs.0.topics.3")
          const nftSeq = Number.parseInt(nftSex, 16)
          console.log("SEQ", nftSeq, nftSex)
          tokenNum = nftSeq.toString()
        } else {
          const supply = await instance.methods.totalSupply.call({
            from: minter,
          }) // last minted is total nfts
          console.log("SUPPLY", supply)
          const nftSeq = Number.parseInt(supply.toString(), 10) - 1
          // tokenNum = ` #${nftSeq}`
          tokenNum = nftSeq.toString()
        }
        // const tokenId = contractId + tokenNum
        const result = {
          success: true,
          txId: receipt?.transactionHash.toString(),
          tokenId: tokenNum,
        }
        console.log("RESULT", result)
        return result
      }
      return { success: false, error: "Something went wrong" }
    } catch (error) {
      // Improved error logging
      console.error("Detailed error:", {
        error,
        contractId,
        address,
        uri,
        chain: this.chain,
        wallet: account.address,
      })
      return { success: false, error: "Transaction failed" }
    }
  }

  // Base erc721 passing metadatauri and token id as uuid instead of auto-incrementing id
  async mintNFT721TBA({
    address,
    tokenId,
    metadataUri,
    contractId,
    walletSeed,
  }: {
    address: string
    tokenId: string
    metadataUri: string
    contractId: string
    walletSeed: string
  }) {
    console.log("Server minting NFT721")
    console.log("ADDRESS", address)
    console.log("TOKENID", tokenId)
    console.log("METADATA", metadataUri)
    //console.log("Chain", this.chain)
    if (!this.web3) {
      console.error("Web3 not available")
      return { success: false, error: "Web3 not available" }
    }
    if (!walletSeed) {
      console.error("Wallet not available")
      return { success: false, error: "Wallet not available" }
    }
    const acct = this.web3.eth.accounts.privateKeyToAccount(walletSeed)
    const minter = acct.address
    const instance = new this.web3.eth.Contract(Abi721tba, contractId)
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest")
    const nonce = Number(noncex)
    //const tokenInt = Number(tokenId)
    console.log("MINTER", minter)
    console.log("NONCE", nonce)
    const data = instance.methods
      .mint(address, tokenId, metadataUri)
      .encodeABI()
    console.log("DATA", data)
    const gas = await this.getGasPrice(minter, contractId, data)
    // FIX: getGasPrice is not returning updated prices
    // const gas = { gasPrice: "0x21c2ac6a00", gasLimit: "0xf4240" } // 145000000000 - 1000000
    console.log("GAS", gas)

    const tx = {
      from: minter, // minter wallet
      to: contractId, // contract address
      value: "0", // this is the value in wei to send
      data: data, // encoded method and params
      gas: gas.gasLimit,
      gasPrice: gas.gasPrice,
      //nonce, // let the chain use the latest
    }
    console.log("TX", tx)

    const sign = await this.web3.eth.accounts.signTransaction(tx, walletSeed)
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction)
    console.log("INFO", info)
    const hasLogs = info.logs?.length > 0
    //const hasTopics = info.logs?.topics?.length > 0
    //const tokenNum = ''
    if (hasLogs) {
      console.log("LOGS.0", JSON.stringify(info?.logs[0].topics, null, 2))
      //console.log("LOGS.1", JSON.stringify(info?.logs[1].topics, null, 2))
      //tokenNum = Buffer.from(_get(info, "logs.0.topics.3", Buffer.alloc(0))).toString("hex")
      //console.log('BIG', info.logs[0]?.topics[3] )
      //tokenNum = info.logs[0]?.topics[3]?.toString()
      //console.log("TOKEN", tokenNum)
    }
    if (info.status === 1n) {
      //const tokenId = `${contractId}#${tokenNum}`
      const result = {
        success: true,
        txId: typeof info?.transactionHash === 'string' ? info.transactionHash : info?.transactionHash?.toString(),
        tokenId,
      }
      console.log("RESULT", result)
      return result
    }
    return { success: false, error: "Something went wrong" }
  }

  // address is receiver, tokenId is db impact id, uri is ipfs:metadata
  async mintNFT1155({
    address,
    tokenId,
    uri,
    contractId,
    walletSeed,
  }: {
    address: string
    tokenId: number
    uri: string
    contractId: string
    walletSeed: string
  }) {
    //console.log(this.chain, "server minting NFT to", address, uri)
    console.log("Server minting NFT 1155")
    console.log("Address", address)
    console.log("TokenId", tokenId)
    console.log("Contract", contractId)
    console.log("URI", uri)
    if (!this.web3 || !walletSeed) {
      console.error("Web3 or wallet not available")
      return { success: false, error: "Web3 or wallet not available" }
    }
    const acct = this.web3.eth.accounts.privateKeyToAccount(walletSeed)
    const minter = acct.address
    const instance = new this.web3.eth.Contract(Abi1155, contractId)
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest")
    const nonce = Number(noncex) + 1
    console.log("MINTER", minter)
    console.log("NONCE", nonce)
    //contract.mint(address account, uint256 id, uint256 amount, bytes memory data)
    //const bytes = Buffer.from(uri, 'utf8')
    //const bytes = this.web3.utils.toHex(uri)
    const bytes = new TextEncoder().encode(uri)
    const hex = bytesToHex(bytes)
    const tokenInt = BigInt(tokenId)
    const data = instance.methods.mint(address, tokenInt, 1, hex).encodeABI()
    console.log("DATA", data)
    const { gasPrice, gasLimit } = await this.getGasPrice(
      minter,
      contractId,
      data,
    )
    const tx = {
      from: minter, // minter wallet
      to: contractId, // contract address
      value: "0", // this is the value in wei to send
      data: data, // encoded method and params
      gas: gasLimit,
      gasPrice: gasPrice,
      //nonce, // let the chain use the latest
    }
    console.log("TX", tx)

    const sign = await this.web3.eth.accounts.signTransaction(tx, walletSeed)
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction)
    console.log("INFO", info)
    const hasLogs = info.logs.length > 0
    let tokenNum = 0
    if (hasLogs) {
      //console.log('LOGS.0', JSON.stringify(info?.logs[0].topics,null,2))
      //console.log('LOGS.0.data', info?.logs[0].data)
      // tokenNum = _get(info, "logs.0").data?.toString().substr(0, 66) || ""
      //const num = info?.logs[0].data.substr(66)
      //const int = num.replace(/^0+/,'')
      // const txt = `0x${BigInt(num).toString(16)}`
      // tokenNum = `${contractId} #${txt}`
      //tokenNum = contract + ' #'+Number.parseInt(num)
      tokenNum = Number(info.logs[0].topics?.[3] ?? 0)
    }
    console.log("LOGS", info.logs?.[0]?.topics)
    if (info.status === 1n) {
      const result = {
        success: true,
        txId: Buffer.from(info?.transactionHash).toString("hex"),
        tokenId: tokenNum,
      }
      console.log("RESULT", result)
      return result
    }
    return { success: false, error: "Something went wrong" }
  }

  async createSellOffer({
    tokenId,
    destinationAddress,
  }: {
    tokenId: string
    destinationAddress: string
    offerExpirationDate?: string
  }) {
    console.log("Creating sell offer", tokenId, destinationAddress)
    // TODO: Implementation for creating a sell offer
    return { success: false, error: "createSellOffer method not implemented." }
  }

  async sendPayment({
    address,
    amount,
    memo,
    walletSeed,
  }: {
    address: string
    amount: number
    memo: string
    walletSeed: string
  }) {
    console.log("Sending payment...")
    const value = this.toBaseUnit(amount)
    if (!this.web3 || !walletSeed) {
      console.error("Web3 or wallet not available")
      return { success: false, error: "Web3 or wallet not available" }
    }
    const acct = this.web3.eth.accounts.privateKeyToAccount(walletSeed)
    const source = acct.address
    const nonce = await this.web3.eth.getTransactionCount(source, "latest")
    const memoHex = this.strToHex(memo)
    const tx = {
      from: source, // minter wallet
      to: address, // receiver
      value: value, // value in wei to send
      data: memoHex, // memo initiative id
    }
    console.log("TX", tx)
    const signed = await this.web3.eth.accounts.signTransaction(tx, walletSeed)
    const result = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction,
    )
    console.log("RESULT", result)
    return { success: true, txId: result }
    //const txHash = await this.fetchLedger({method: 'eth_sendTransaction', params: [tx]})
    //console.log({txHash});
  }

  // async getTransactionInfo(txId: string) {
  //   console.log("Get tx info", txId)
  //   const info = await this.fetchLedger("eth_getTransactionByHash", [txId])
  //   if (!info || info?.error) {
  //     return { success: false, error: "Error fetching tx info" }
  //   }
  //   const result = {
  //     success: true,
  //     account: info?.from,
  //     destination: info?.to,
  //     destinationTag: this.hexToStr(info?.input),
  //     amount: this.fromBaseUnit(info?.value),
  //   }
  //   return result
  // }
  async getTransactionInfo(txId: string, wait?: boolean) {
    const secs = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
    let count = 0
    if (!wait) {
      count = 9
    }
    while (count < 10) {
      count += 1
      console.log("WAIT", count, "-", secs[count], "secs")
      await sleep(secs[count] * 1000)
      const txInfo = await this.fetchLedger("eth_getTransactionByHash", [txId])
      console.log("TXINFO", txInfo)
      if (!txInfo || txInfo.error) {
        return { error: "Transaction not found" }
      }
      if (txInfo?.hash) {
        return {
          id: txInfo.hash,
          hash: txInfo.hash,
          from: txInfo.from,
          to: txInfo.to,
          value: txInfo.value,
          fee: (BigInt(txInfo.gas) * BigInt(txInfo.gasPrice)).toString(),
          blockNumber: Number.parseInt(txInfo.blockNumber, 16),
          timestamp: "", // Ethereum transactions do not directly provide a timestamp
        }
      }
    }
    return { error: "Transaction not found" }
  }

  async fetchLedger(method: string, params: unknown) {
    if (!this.network) {
      console.error("Chain not set, run setChain first")
      return { success: false, error: "Chain not set" }
    }
    console.log("FETCH", this?.network?.rpcUrls?.default)
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
      return { error: "Unknown error" }
    }
  }
}
