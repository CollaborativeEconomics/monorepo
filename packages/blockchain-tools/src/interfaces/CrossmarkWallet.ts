import { type Payment, type Amount, Client } from "xrpl"
import sdk from '@crossmarkio/sdk'
import XrplCommon from "./XrplCommon"

export default class CrossmarkWallet extends XrplCommon {
  connectedWallet = ''

  async connect(){
    try {
      const { request, response, createdAt, resolvedAt } = await sdk.methods.signInAndWait()
      const address = response?.data?.address || ''
      this.connectedWallet = address
      console.log('Crossmark', address)
      return {
        success: true,
        walletAddress: this.connectedWallet,
        network: this.network.slug,
      }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch(ex:any) {
      console.error(ex)
      return { success: false, error: ex instanceof Error ? ex.message : "" }
    }
  }

  async sendPayment({ address, amount, memo }: { address: string; amount: number; memo?: string }) {
    console.log('PAY', address, amount, memo)
    /* TODO: FIX
    const sender = this.connectedWallet
    const wei = Math.floor(amount * 1000000).toString()  // <<<<<<< HERE
    //const wei = String(this.toBaseUnit(amount))
    const transaction = {
      TransactionType: 'Payment',
      Account: sender,
      Destination: address,
      Amount: wei
    } as Payment
    console.log('TX', transaction)
    const {
      request,
      response,
      createdAt,
      resolvedAt
    } = await sdk.methods.signAndSubmitAndWait(transaction)
    console.log('RES', response)
    //console.log('TXID', response?.data?.resp?.hash)
    */
    return {success:true}
    
    //if (code === "tesSUCCESS") {
    //  console.log('Transaction succeeded')
    //  return {success:true}
    //}
    //console.log('Error sending transaction:', code)
    //return {success:false, error:'Error sending payment'}
  }

}
