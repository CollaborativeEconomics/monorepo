import appConfig from "@cfce/app-config"
import {
  chainConfig,
  getChainConfiguration,
  getRpcUrl,
} from "@cfce/blockchain-tools"
import {
  Address,
  BASE_FEE,
  Contract,
  FeeBumpTransaction,
  Horizon,
  Keypair,
  Networks,
  Operation,
  SorobanDataBuilder,
  type Transaction,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk"
import type { StellarNetwork } from "../networks"

//---- SUBMIT TX

const HORIZON_URL = getRpcUrl(
  "stellar",
  appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network,
  "horizon",
)
const SOROBAN_URL = getRpcUrl(
  "stellar",
  appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network,
  "soroban",
)
//const SOROBAN_URL = 'https://small-shy-borough.stellar-mainnet.quiknode.pro/53e6763ed40e4bc3202a8792d6d2d51706052755/'
//const SOROBAN_URL = 'https://mainnet.stellar.validationcloud.io/v1/QW6tYBRenqUwP8d9ZJds44Dm-txH1497oDXcdC07xDo'
//const SOROBAN_URL = 'https://soroban-mainnet.nownodes.io/32b582fb-d83b-44fc-8788-774de28395cb'

//const SOROBAN_URL = "https://rpc-futurenet.stellar.org:443";
//const SOROBAN_URL = "https://soroban-testnet.stellar.org/";
if (!SOROBAN_URL) {
  throw new Error("Soroban URL not set")
}
const server = new rpc.Server(SOROBAN_URL)
//const server = new rpc.Server(QUIKNODE_URL);
//console.log('>Server Loaded', server)
/*
// Submits a tx and then polls for its status until a timeout is reached.
async function submitTx2(tx){
  return server.sendTransaction(tx).then(async (reply) => {
    if (reply.status !== "PENDING") {
      throw reply;
    }

    let status;
    let attempts = 0;
    while (attempts++ < 5) {
      const tmpStatus = await server.getTransaction(reply.hash);
      switch (tmpStatus.status) {
        case "FAILED":
          throw tmpStatus;
        case "NOT_FOUND":
          await sleep(500);
          continue;
        case "SUCCESS":
          status = tmpStatus;
          break;
      }
    }

    if (attempts >= 5 || !status) {
      throw new Error(`Failed to find transaction ${reply.hash} in time.`);
    }

    return status;
  });
}
*/

async function submitTx(tx: Transaction) {
  try {
    const response = await server.sendTransaction(tx)
    console.log(`Sent transaction: ${JSON.stringify(response)}`)
    const txid = response.hash

    if (response.status === "PENDING") {
      let result = await server.getTransaction(response.hash)
      // Poll `getTransaction` until the status is not "NOT_FOUND"
      while (result.status === "NOT_FOUND") {
        console.log("Waiting for transaction confirmation...")
        // See if the transaction is complete
        result = await server.getTransaction(response.hash)
        // Wait one second
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      //console.log(`getTransaction response: ${JSON.stringify(result)}`);
      console.log("Status:", result.status)
      if (result.status === "SUCCESS") {
        console.log("RESULT:", result)
        // Make sure the transaction's resultMetaXDR is not empty
        if (!result.resultMetaXdr) {
          throw "Empty resultMetaXDR in getTransaction response"
        }
        // Find the return value from the contract and return it
        const transactionMeta = result.resultMetaXdr
        //const metares  = result.resultMetaXdr.v3().sorobanMeta().returnValue();
        //console.log('METARES:', metares);
        const returnValue = result.returnValue //parseResultXdr(result.returnValue);
        //const metaXDR = SorobanClient.xdr.TransactionMeta.fromXDR(result.resultMetaXdr, "base64")
        //console.log('METAXDR:', JSON.stringify(metaXDR,null,2));
        //console.log('Return meta:', JSON.stringify(transactionMeta,null,2));
        console.log("Return value:", JSON.stringify(returnValue, null, 2))
        //console.log(`Return value: ${returnValue}`);
        return {
          success: true,
          value: returnValue,
          meta: transactionMeta,
          txid,
        }
      }
      console.log("XDR:", JSON.stringify(result.resultXdr, null, 2))
      throw `Transaction failed: ${result.resultXdr}`
    }
    throw response.errorResult
  } catch (err) {
    // Catch and report any errors we've thrown
    console.log("Sending transaction failed")
    console.log(err)
    console.log(JSON.stringify(err))
    return { success: false, error: err instanceof Error ? err.message : err }
  }
}

//---- RESTORE DATA

// assume that `server` is the Server() instance from the preamble
async function submitOrRestoreAndRetry(signer: Keypair, tx: Transaction) {
  // We can't use `prepareTransaction` here because we want to do
  // restoration if necessary, basically assembling the simulation ourselves.
  const sim = await server.simulateTransaction(tx)

  // Other failures are out of scope of this tutorial.
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw sim
  }

  // If simulation didn't fail, we don't need to restore anything! Just send it.
  if (!rpc.Api.isSimulationRestore(sim)) {
    console.log("No contract restore needed")
    //const prepTx = assembleTransaction(tx, sim);
    //console.log(prepTx)
    //prepTx.sign(signer);

    const prepTx = await server.prepareTransaction(tx)
    console.log(prepTx)
    prepTx.sign(signer)

    const rest = await submitTx(prepTx)
    //console.log(rest)
    return rest
  }

  //
  // Build the restoration operation using the RPC server's hints.
  //
  console.log("Restore Contract...")
  const account = await server.getAccount(signer.publicKey())
  let fee = Number.parseInt(BASE_FEE)
  fee += Number.parseInt(sim.restorePreamble.minResourceFee)

  const restoreTx = new TransactionBuilder(account, { fee: fee.toString() })
    .setNetworkPassphrase(tx.networkPassphrase)
    .setSorobanData(sim.restorePreamble.transactionData.build())
    .addOperation(Operation.restoreFootprint({}))
    .setTimeout(30)
    .build()

  restoreTx.sign(signer)

  const resp = await submitTx(restoreTx)
  console.log({ resp })
  //if (resp?.status !== Api.GetTransactionStatus.SUCCESS) {
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

  const resx = await submitTx(retryTx)
  console.log("Restored?", resx)
  return resx
}

//---- RESTORE CONTRACT

async function restoreContract(
  signer: Keypair,
  contract: Contract,
  network: StellarNetwork,
) {
  const instance = contract.getFootprint()
  const account = await server.getAccount(signer.publicKey())
  // @ts-ignore: why this type fails? Stellar docs broken?
  const wasmEntry = await server.getLedgerEntries(getWasmLedgerKey(instance))
  // const wasmEntry = await server.getContractWasmByContractId(contract.contractId())
  const data = new SorobanDataBuilder()
    // @ts-ignore: why wasmEntry isn't a ledger key? Bad docs again?
    .setReadWrite([instance, wasmEntry])
    .build()
  const restoreTx = new TransactionBuilder(account, { fee: BASE_FEE })
    .setNetworkPassphrase(network.passphrase ?? "")
    .setSorobanData(data) // Set the restoration footprint (remember, it should be in the read-write part!)
    .addOperation(Operation.restoreFootprint({}))
    .build()
  const preppedTx = await server.prepareTransaction(restoreTx)
  preppedTx.sign(signer)
  return submitTx(preppedTx)
}

function getWasmLedgerKey(entry: xdr.ContractDataEntry) {
  const hash = entry.val().instance().executable().wasmHash()
  const code = new xdr.LedgerKeyContractCode({ hash })
  return xdr.LedgerKey.contractCode(code)
}

//---- RUN

export async function submit(
  network: StellarNetwork,
  secret: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[],
) {
  const source = Keypair.fromSecret(secret)
  const server = new rpc.Server(network.soroban)
  const contract = new Contract(contractId)
  const account = await server.getAccount(source.publicKey())
  console.log({ network, contractId, method, args })

  const op = contract.call(method, ...args)
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: network.passphrase,
  })
    .addOperation(op)
    .setTimeout(30)
    .build()

  try {
    const resp = await submitOrRestoreAndRetry(source, tx)
    console.log("RESP", resp)
    if (resp.success) {
      //const meta:any = resp.meta
      //console.log('META', JSON.stringify(meta,null,2))
      //console.log('Return value:', resp?.value)
      if (!resp?.value) {
        throw new Error("No value returned")
      }
      const resval = scValToNative(resp?.value)
      console.log("Return value:", resval)
      return { success: true, value: resval, error: null }
    }
    return {
      success: false,
      value: "",
      error: "Error submitting transaction",
    }
  } catch (err) {
    // Catch and report any errors we've thrown
    console.log("Error sending transaction", err)
    return {
      success: false,
      value: "",
      error: err instanceof Error ? err.message : "Error sending transaction",
    }
  }
}

export async function checkContract(
  network: StellarNetwork,
  secret: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[],
) {
  try {
    console.log("CHECK", network, secret, contractId, method)
    const source = Keypair.fromSecret(secret)
    const pubkey = source.publicKey()
    const rpcUrl = network.soroban
    console.log("CHECK1:", pubkey)
    console.log("CHECK2:", rpcUrl)
    const contract = new Contract(contractId)
    console.log("CHECK3")
    if (!HORIZON_URL) {
      throw new Error("Horizon URL not set")
    }
    const horizon = new Horizon.Server(HORIZON_URL)
    const account = await horizon.loadAccount(pubkey)

    console.log("CHECK4:", account?.id)
    const op = contract.call(method, ...args)
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: network.passphrase,
    })
      .addOperation(op)
      .setTimeout(30)
      .build()

    console.log("CHECK5:", tx)
    const sim = await server.simulateTransaction(tx)
    console.log("CHECK6:", sim)
    if (!rpc.Api.isSimulationSuccess(sim)) {
      console.log("Error: Contract could not be restored")
      console.log("SIM:", sim)
      return { ready: false }
      //throw sim
    }
    if (rpc.Api.isSimulationRestore(sim)) {
      console.log("Contract needs to be restored")
      const result = await restoreContract(source, contract, network)
      console.log("RESTORED", result)
      return { ready: true }
    }
    console.log("Contract is ready")
    return { ready: true }
  } catch (ex) {
    console.error("Restore Error:", ex)
    return { ready: false }
  }
}
