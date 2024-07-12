"use client"

import Wallet from "../../interfaces/freighter" // TODO: Placeholder for actual wallet import
import Stellar from "./common"

type Dictionary = { [key: string]: any }

interface StellarOptions {
  network?: "mainnet" | "testnet"
}

class StellarClient extends Stellar {
  constructor({ network = "mainnet" } = {} as StellarOptions) {
    super()
    this.network = network
    this.provider = network === "mainnet" ? this.mainnet : this.testnet
    this.wallet = new Wallet()
  }

  async connect(callback: (options: Record<string, any>) => void) {
    console.log("XLM Connecting...")
    const result = await this.wallet.connect()
    console.log("Freighter session:", result)
    if (result) {
      const address = result.account
      const network = result.network
      const topic = "" //result.topic
      const data = {
        wallet: "freighter",
        address: address,
        chain: this.chain,
        chaindid: "",
        currency: this.symbol,
        network: network,
        token: "",
        topic: topic,
      }
      callback(data)
    } else {
      callback(result)
    }
  }

  async sendPayment(
    address: string,
    amount: number,
    destinTag: string,
    callback: (data: Dictionary) => void,
  ) {
    try {
      const connect = await this.wallet.connect()
      console.log("Wallet restored...", connect)
      const source = connect?.account
      console.log("SOURCE", source)
      if (!source) {
        console.log("Error: Signature rejected by user")
        callback({ success: false, error: "Signature rejected by user" })
        return
      }
      const currency = this.symbol
      const issuer = ""
      const memo = destinTag ? "tag:" + destinTag : ""
      //const {txid, xdr} = await this.paymentXDR(source, address, amount, currency, issuer, memo)
      //console.log('txid', txid)
      //this.wallet.signAndSubmit(xdr, async result=>{
      //  console.log('UI RESULT', result)
      //  if(result?.error){
      //    console.log('Error', result.error)
      //    callback({success:false, error:'Error sending payment'})
      //    return
      //  }
      //  console.log('Result', result)
      //  callback({success:true, txid})
      //})
      const result = await this.wallet.payment(address, amount, memo)
      callback(result)
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        callback({ error: ex.message })
      }
    }
  }

  /*
  async paymentXDR(source, destin, amount, currency, issuer, memo='') {
    console.log('PAYMENT', source, destin, amount, currency, issuer, memo)
    const server = new StellarSdk.Server(this.provider.rpcurl)
    const account = await server.loadAccount(source)
    //const baseFee = await server.fetchBaseFee()
    //const network = StellarSdk.Networks.PUBLIC
    const network = (this.network=='mainnet' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET)
    const operation = StellarSdk.Operation.payment({
      destination: destin,
      amount: amount,
      asset: StellarSdk.Asset.native()
    })
    const transaction = new StellarSdk.TransactionBuilder(account, {networkPassphrase: network, fee:StellarSdk.BASE_FEE})
    const tx = transaction.addOperation(operation)
    if(memo) { tx.addMemo(StellarSdk.Memo.text(memo)) }
    const built = tx.setTimeout(120).build()
    const txid  = built.hash().toString('hex')
    const xdr   = built.toXDR()
    //console.log('XDR:', xdr)
    //console.log('HASH:', txid)
    return {txid, xdr}
  }
*/
}

export default StellarClient
