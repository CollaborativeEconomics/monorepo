import appConfig from "@cfce/app-config"
import { signTransaction } from "@stellar/freighter-api"
import {
  Account,
  Address,
  Asset,
  BASE_FEE,
  Contract,
  Horizon,
  Keypair,
  Networks,
  Operation,
  SorobanRpc,
  Transaction,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk"
import { networks } from "~/contracts/networks"

// FIX: Bug in Soroban, register user in contract on first use: invokeHostFunctionResourceLimitExceeded
// https://github.com/eigerco/nebula/issues/41#issuecomment-1733511887
export default async function registerUser(contractId: string, from: string) {
  try {
    console.log("-- Register", contractId, from)
    const netname =
      appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network
    console.log("NETENV", netname)
    const network = networks[netname]
    console.log("NETWORK", network)
    const soroban = new SorobanRpc.Server(network.soroban, { allowHttp: true })
    const adr = new Address(from).toScVal()
    const ctr = new Contract(contractId)
    console.log("CTR", ctr)
    const op = ctr.call("register", adr)
    //const op = ctr.call('getBalance')
    console.log("OP", op)
    const account = await soroban.getAccount(from)
    console.log("ACT", account)
    //const base = await horizon.fetchBaseFee()
    //const fee = base.toString()
    const fee = BASE_FEE
    const trx = new TransactionBuilder(account, {
      fee,
      networkPassphrase: network.passphrase,
    })
      .addOperation(op)
      .setTimeout(30)
      .build()
    console.log("TRX", trx)
    const sim = await soroban.simulateTransaction(trx)
    console.log("SIM", sim)
    if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
      console.log("RES", sim.result)
      return true
    }
    return false
    /*
      // Now prepare it???
      const txp = await soroban.prepareTransaction(trx)
      console.log('TXP',txp)
      const xdr = txp.toXDR()
      console.log('XDR', xdr)
      // Now sign it???
      const opx = {networkPassphrase: network.passphrase}
      //const opx = {network:network.name, networkPassphrase: network.passphrase, accountToSign: from}
      console.log('OPX', opx)
      const sgn = await signTransaction(xdr, opx)
      console.log('SGN', sgn)
      // Now send it?
      const txs = TransactionBuilder.fromXDR(sgn, network.passphrase) // as Tx
      console.log('TXS', txs)
      const res = await soroban.sendTransaction(txs)
      console.log('RES', res)
      console.log('JSN', JSON.stringify(res,null,2))

      const txid = res?.hash || ''
      console.log('TXID', txid)
      if(res?.status.toString() == 'ERROR'){
        console.log('REG ERROR')
        return false
      }
      if(res?.status.toString() == 'SUCCESS'){
        console.log('REG SUCCESS')
        return true
      } else {
        // Wait for confirmation
        const secs = 1000
        const wait = [2,2,2,3,3,3,4,4,4,5,5,5,6,6,6] // 60 secs / 15 loops
        let count = 0
        let info = null
        while(count < wait.length){
          console.log('Retry', count)
          await new Promise(res => setTimeout(res, wait[count]*secs))
          count++
          info = await soroban.getTransaction(txid)
          console.log('INFO', info)
          if(info.status=='ERROR') {
            console.log('REG FAILED')
            return false
          }
          if(info.status=='NOT_FOUND' || info.status=='PENDING') {
            continue // Not ready in blockchain?
          }
          if(info.status=='SUCCESS'){
            console.log('REG SUCCESS')
            return true
          } else {
            console.log('REG FAILED')
            return false
          }
        }
        console.log('REG TIMEOUT')
        return false
      }
    } else {
      console.log('BAD REG')
      return false
    }
*/
  } catch (ex) {
    console.log("REG ERROR", ex)
    return false
  }
}
