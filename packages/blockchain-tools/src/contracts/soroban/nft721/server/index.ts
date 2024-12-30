import type { NetworkConfig } from "@cfce/types"
import {
  // Address,
  BASE_FEE,
  Contract,
  // FeeBumpTransaction,
  Keypair,
  // nativeToScVal,
  // Networks,
  Operation,
  rpc,
  SorobanDataBuilder,
  //SorobanRpc,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk"
import type { Transaction } from "@stellar/stellar-sdk"
//const { Api } = SorobanRpc
import _get from "lodash/get"

export default class Contract721 {
  contractId: string
  rpcUrl: string
  secret: string
  server: rpc.Server
  constructor({
    contractId,
    rpcUrl,
    secret,
  }: { contractId: string; rpcUrl: string; secret: string }) {
    this.contractId = contractId
    this.rpcUrl = rpcUrl
    this.secret = secret
    this.server = new rpc.Server(rpcUrl)
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async submitTx(tx: Transaction) {
    try {
      const response = await this.server.sendTransaction(tx)
      console.log(`Sent transaction: ${JSON.stringify(response)}`)
      const txid = response.hash

      if (response.status === "PENDING") {
        let result = await this.server.getTransaction(response.hash)
        // Poll `getTransaction` until the status is not "NOT_FOUND"
        while (result.status === "NOT_FOUND") {
          console.log("Waiting for transaction confirmation...")
          // See if the transaction is complete
          result = await this.server.getTransaction(response.hash)
          // Wait two seconds
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
        //console.log(`getTransaction response: ${JSON.stringify(result)}`);
        console.log("Status:", result.status)
        if (result.status === "SUCCESS") {
          // Make sure the transaction's resultMetaXDR is not empty
          if (!result.resultMetaXdr) {
            console.log("Error: Empty resultMetaXDR")
            throw "Empty resultMetaXDR in getTransaction response"
          }
          // Find the return value from the contract and return it
          const transactionMeta = result.resultMetaXdr
          const returnValue = result.returnValue
          console.log("Return value:", JSON.stringify(returnValue, null, 2))
          //console.log(`Return value: ${returnValue}`);
          return {
            success: true,
            value: returnValue,
            meta: transactionMeta,
            txid,
          }
        }
        //console.log('RESULTX:', JSON.stringify(result,null,2));
        console.log(
          "ERROR IN TRANSACTION:",
          JSON.stringify(result.resultXdr, null, 2),
        )
        throw `Transaction failed: ${result.resultXdr}`
      }
    } catch (err) {
      // Catch and report any errors we've thrown
      console.log("Sending transaction failed")
      console.log("Error:", err)
      console.log(JSON.stringify(err))
      if (err instanceof Error) {
        return { success: false, error: err.message }
      }
      return { success: false, error: "Unknown error" }
    }
  }

  //---- RESTORE

  // assume that `server` is the Server() instance from the preamble
  async submitOrRestoreAndRetry(signer: Keypair, tx: Transaction) {
    // We can't use `prepareTransaction` here because we want to do
    // restoration if necessary, basically assembling the simulation ourselves.
    const sim = await this.server.simulateTransaction(tx)

    // Other failures are out of scope of this tutorial.
    if (!rpc.Api.isSimulationSuccess(sim)) {
      console.log("Error simulating")
      throw sim
    }

    // If simulation didn't fail, we don't need to restore anything! Just send it.
    if (!rpc.Api.isSimulationRestore(sim)) {
      console.log("No contract restore needed")
      //const prepTx = assembleTransaction(tx, sim);
      //console.log(prepTx)
      //prepTx.sign(signer);

      const prepTx = await this.server.prepareTransaction(tx)
      console.log("PREPTX", prepTx)
      prepTx.sign(signer)
      console.log("SIGNTX", prepTx)
      const rest = await this.submitTx(prepTx)
      console.log(rest)
      return rest
    }

    //
    // Build the restoration operation using the RPC server's hints.
    //
    console.log("Restore Contract...")
    const account = await this.server.getAccount(signer.publicKey())
    let fee = Number.parseInt(BASE_FEE)
    fee += Number.parseInt(sim.restorePreamble.minResourceFee)

    const restoreTx = new TransactionBuilder(account, { fee: fee.toString() })
      .setNetworkPassphrase(tx.networkPassphrase)
      .setSorobanData(sim.restorePreamble.transactionData.build())
      .addOperation(Operation.restoreFootprint({}))
      .setTimeout(30)
      .build()

    restoreTx.sign(signer)

    const resp = await this.submitTx(restoreTx)
    console.log({ resp })
    //if (resp?.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    if (!resp?.success) {
      //throw resp;
      console.log("Error restoring contract", resp)
      return { success: false, error: "Error restoring contract" }
    }

    //
    // now that we've restored the necessary data, we can retry our tx using
    // the initial data from the simulation (which, hopefully, is still
    // up-to-date)
    //
    const retryTxBuilder = TransactionBuilder.cloneFrom(tx, {
      fee: (
        Number.parseInt(tx.fee) + Number.parseInt(sim.minResourceFee)
      ).toString(),
      sorobanData: sim.transactionData.build(),
    })

    // because we consumed a sequence number when restoring, we need to make sure we set the correct value on this copy
    // @ts-ignore: types suck donkey balls
    retryTxBuilder?.source?.incrementSequenceNumber()

    const retryTx = retryTxBuilder.build()
    retryTx.sign(signer)

    const resx = await this.submitTx(retryTx)
    console.log("Restored?", resx)
    return resx
  }

  //---- RESTORE

  async restoreContract(
    signer: Keypair,
    contract: Contract,
    network: NetworkConfig,
  ) {
    console.log("RESTORE CHAIN TOOLS", contract, network)
    const instance = contract.getFootprint()
    const account = await this.server.getAccount(signer.publicKey())
    console.log("ACT", account)
    const wasmKey = this.getWasmLedgerKey(instance)
    console.log("WASM", wasmKey)
    // @ts-ignore: why this type fails? Stellar docs broken?
    const wasmEntry = await this.server.getLedgerEntries(wasmKey)
    const data = new SorobanDataBuilder()
      // @ts-ignore: types suck donkey balls
      .setReadWrite([instance, wasmEntry])
      .build()
    if (typeof network.networkPassphrase !== "string") {
      throw new Error("networkPassphrase is not a string")
    }
    const restoreTx = new TransactionBuilder(account, { fee: BASE_FEE })
      .setNetworkPassphrase(network.networkPassphrase)
      .setSorobanData(data) // Set the restoration footprint (remember, it should be in the read-write part!)
      .addOperation(Operation.restoreFootprint({}))
      .build()

    const preppedTx = await this.server.prepareTransaction(restoreTx)
    preppedTx.sign(signer)
    return this.submitTx(preppedTx)
  }

  getWasmLedgerKey(entry: xdr.LedgerKey) {
    const hash = entry.contractCode().hash()
    const key = { hash }
    const code = new xdr.LedgerKeyContractCode(key)
    const res = xdr.LedgerKey.contractCode(code)
    return res
  }

  //---- RUN

  async submit({
    network,
    secret,
    contractId,
    method,
    args,
  }: {
    network: NetworkConfig
    secret: string
    contractId: string
    method: string
    args: any
  }) {
    const source = Keypair.fromSecret(secret)
    //const server   = new rpc.Server(network.soroban)
    const contract = new Contract(contractId)
    const account = await this.server.getAccount(source.publicKey())
    console.log("SUBMIT", { network, contractId, method, args })

    const op = contract.call(method, ...args)
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: network.networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(30)
      .build()

    try {
      const resp = await this.submitOrRestoreAndRetry(source, tx)
      console.log("RESP", resp)
      if (resp?.success) {
        const meta = resp.meta
        const lastId = _get(
          meta,
          "_value._attributes.sorobanMeta._attributes.events.0._attributes.body._value._attributes.data._value._attributes.lo._value",
        )
        //console.log('META', JSON.stringify(meta,null,2))
        const tokenId = lastId ? `${contractId} #${lastId}` : resp?.txid
        console.log("TOKENID", tokenId)
        return { success: true, tokenId }
      }
      return { success: false, error: "Error minting NFT" }
    } catch (err) {
      // Catch and report any errors we've thrown
      console.log("Error sending transaction", err)
      if (err instanceof Error) {
        return {
          success: false,
          error: err.message,
        }
      }
      return {
        success: false,
        error: "Error minting NFT",
      }
    }
  }

  async checkContract({
    network,
    secret,
    contractId,
    method,
    args,
  }: {
    network: NetworkConfig
    secret: string
    contractId: string
    method: string
    args: any
  }) {
    const source = Keypair.fromSecret(secret)
    //const this.server   = new rpc.Server(network.soroban)
    const contract = new Contract(contractId)
    const account = await this.server.getAccount(source.publicKey())
    console.log({ network, contractId, method, args })

    const op = contract.call(method, ...args)
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: network.networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(30)
      .build()

    const sim = await this.server.simulateTransaction(tx)
    if (!rpc.Api.isSimulationSuccess(sim)) {
      throw sim
    }
    if (rpc.Api.isSimulationRestore(sim)) {
      console.log("Contract needs to be restored")
      const result = await this.restoreContract(source, contract, network)
      console.log("RESULT", result)
      return { ready: true }
    }
    console.log("Contract is ready")
    return { ready: true }
  }
}
