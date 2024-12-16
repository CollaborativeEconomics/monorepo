import type { ChainSlugs, Network } from "@cfce/types"
import _get from "lodash/get"
import Web3 from "web3"
import ChainBaseClass from "../chains/ChainBaseClass"
import Abi721inc from "../contracts/solidity/erc721/erc721inc-abi.json" // autoincrements tokenid
import Abi721base from "../contracts/solidity/erc721/erc721base-abi.json" // must pass tokenid
import Abi1155 from "../contracts/solidity/erc1155/erc1155-abi.json"
// import { Transaction } from "../types/transaction"


// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getObjectValue(obj:any, prop:string) {
  return prop.split('.').reduce((r, val) => { return r ? r[val] : undefined; }, obj)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Web3Server extends ChainBaseClass {
  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    this.web3 = new Web3(this.network.rpcUrls.main)
  }

  async getGasPrice(minter: string, contractId: string, data: string) {
    const gasPrice = await this.fetchLedger("eth_gasPrice", [])
    console.log("GAS", Number.parseInt(gasPrice, 16), gasPrice)
    const checkGas = await this.fetchLedger("eth_estimateGas", [ { from: minter, to: contractId, data } ]) || '0x1e8480' // 2000000
    console.log("EST", Number.parseInt(checkGas, 16), checkGas)
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
    console.log('CHAIN', this.chain)
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
    const data = instance.methods.mint(address, uri).encodeABI()
    console.log("DATA", data)
    let gas = await this.getGasPrice(minter, contractId, data)
    // FIX: getGasPrice in XDC is not returning updated prices
    if(this.chain.slug==='xdc'){
      gas = {gasPrice:'0x21c2ac6a00', gasLimit:'0xf4240'}  // 145000000000 - 1000000
    }
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
    //const hasLogs = info.logs?.length > 0
    //const hasTopics = hasLogs && info.logs[0]?.topics?.length > 0
    let tokenNum = ""
    if(info.logs?.length > 0) {
      console.log("LOGS.0", JSON.stringify(info?.logs[0].topics, null, 2))
      //console.log("LOGS.1", JSON.stringify(info?.logs[1].topics, null, 2))
      //tokenNum = ` #${Number.parseInt(Buffer.from(_get(info, "logs.0.topics.3", Buffer.alloc(0))).toString("hex"), 16)}` // Doesn't work as expected
      //const nftSeq = Number.parseInt((info?.logs[0]?.topics[3] || 0).toString(),16)
      //const nftSex = info?.logs?.[0]?.topics?.[3]
      const nftSex = getObjectValue(info, 'logs.0.topics.3')
      const nftSeq = Number.parseInt(nftSex,16)
      console.log('SEQ', nftSeq, nftSex)
      tokenNum = ` #${nftSeq}`
    } else {
      const supply = await instance.methods.totalSupply.call({from:minter}) // last minted is total nfts
      console.log('SUPPLY', supply)
      const nftSeq = Number.parseInt(supply.toString(),10) - 1
      tokenNum = ` #${nftSeq}`
    }
    if (info.status === 1n) {
      const tokenId = contractId + tokenNum
      const result = {
        success: true,
        //txId: Buffer.from(info?.transactionHash).toString("hex"),
        //txId: info?.transactionHash,
        txId: info?.transactionHash.toString(),
        tokenId,
      }
      console.log("RESULT", result)
      return result
    }
    return { success: false, error: "Something went wrong" }
  }

  // Base erc721 passing token id as uuid instead of auto-incrementing id
  async mintNFT721({
    address,
    tokenId,
    contractId,
    walletSeed
  }: { address: string; tokenId: string; contractId: string; walletSeed: string }) {
    console.log('Server minting NFT721 to', address, 'tokenID', tokenId)
    console.log('Chain', this.chain)
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
    const instance = new this.web3.eth.Contract(Abi721base, contractId)
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest")
    const nonce = Number(noncex)
    //const tokenInt = Number(tokenId)
    console.log("MINTER", minter)
    console.log("NONCE", nonce)
    const data = instance.methods.safeMint(address, tokenId).encodeABI()
    console.log("DATA", data)
    //const gas = await this.getGasPrice(minter, contractId, data)
    // FIX: getGasPrice is not returning updated prices
    const gas = {gasPrice:'0x21c2ac6a00', gasLimit:'0xf4240'}  // 145000000000 - 1000000
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
        txId: Buffer.from(info?.transactionHash).toString("hex"),
        //txId: info?.transactionHash,
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
    tokenId: string
    uri: string
    contractId: string
    walletSeed: string
  }) {
    console.log(this.chain, "server minting NFT to", address, uri)
    if (!this.web3 || !walletSeed) {
      console.error("Web3 or wallet not available")
      return { success: false, error: "Web3 or wallet not available" }
    }
    const acct = this.web3.eth.accounts.privateKeyToAccount(walletSeed)
    const minter = acct.address
    const instance = new this.web3.eth.Contract(Abi1155, contractId)
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest")
    const nonce = Number(noncex)
    console.log("MINTER", minter)
    console.log("NONCE", nonce)
    //contract.mint(address account, uint256 id, uint256 amount, bytes memory data)
    //const bytes = Buffer.from(uri, 'utf8')
    const bytes = this.web3.utils.toHex(uri)
    const data = instance.methods.mint(address, tokenId, 1, bytes).encodeABI()
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
      nonce,
    }
    console.log("TX", tx)

    const sign = await this.web3.eth.accounts.signTransaction(tx, walletSeed)
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction)
    console.log("INFO", info)
    const hasLogs = info.logs.length > 0
    let tokenNum = ""
    if (hasLogs) {
      //console.log('LOGS.0', JSON.stringify(info?.logs[0].topics,null,2))
      //console.log('LOGS.0.data', info?.logs[0].data)
      const num = _get(info, "logs.0").data?.toString().substr(0, 66) || ""
      //const num = info?.logs[0].data.substr(66)
      //const int = num.replace(/^0+/,'')
      const txt = `0x${BigInt(num).toString(16)}`
      tokenNum = `${contractId} #${txt}`
      //tokenNum = contract + ' #'+Number.parseInt(num)
    }
    if (info.status === 1) {
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
  async getTransactionInfo(txId: string, wait?:boolean) {
    const secs = [2,2,3,3,4,4,5,5,6,6]
    let count = 0
    if(!wait){ count = 9 }
    while(count<10){
      count += 1
      console.log('WAIT', count, '-', secs[count], 'secs')
      await sleep(secs[count]*1000)
      const txInfo = await this.fetchLedger("eth_getTransactionByHash", [txId])
      console.log('TXINFO', txInfo)
      if (!txInfo || txInfo.error) {
        return { error: "Transaction not found" }
      }
      if(txInfo?.hash){
        return {
          id: txInfo.hash,
          hash: txInfo.hash,
          from: txInfo.from,
          to: txInfo.to,
          value: txInfo.value,
          fee: (BigInt(txInfo.gas) * BigInt(txInfo.gasPrice)).toString(),
          blockNumber: Number.parseInt(txInfo.blockNumber, 16),
          timestamp: "" // Ethereum transactions do not directly provide a timestamp
        }
      }
    }
    return { error: "Transaction not found" }
  }

  async fetchLedger(method: string, params: unknown) {
    console.log('FETCH', this.network.rpcUrls.main)
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
      return { error: "Unknown error" }
    }
  }
}
