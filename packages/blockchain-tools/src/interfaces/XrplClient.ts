import { type Payment, Client } from "xrpl"
import XrplCommon from "./XrplCommon"

export default class XrplClient extends XrplCommon {

  async sendPayment({ address, amount, memo }: { address: string; amount: number; memo?: string }) {
    console.log('PAY', address, amount, memo)
    const sender = '0x0' // TODO: get from wallet
    //const wei = Math.floor(amount * 1000000).toString()
    const wei = String(this.toBaseUnit(amount))
    const transaction = {
      TransactionType: 'Payment',
      Account: sender,
      Destination: address,
      Amount: wei
    } as Payment
    const url = this.network.rpcUrls.main
    const client = new Client(url)
    await client.connect()
    //const payment = await client.autofill(transaction)
    //const res = await client.submit(payment)
    const res = await client.submitAndWait(transaction)
    console.log('RES', res)
    //const code = res?.result?.meta?.TransactionResult
    client.disconnect()
    return {success:true}
    
    //if (code === "tesSUCCESS") {
    //  console.log('Transaction succeeded')
    //  return {success:true}
    //}
    //console.log('Error sending transaction:', code)
    //return {success:false, error:'Error sending payment'}
  }




}
