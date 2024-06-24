import { Address, BASE_FEE, Contract, FeeBumpTransaction, Keypair, nativeToScVal, Networks, Operation, SorobanDataBuilder, SorobanRpc, Transaction, TransactionBuilder, xdr } from "@stellar/stellar-sdk";
const { Api, assembleTransaction } = SorobanRpc;

function sleep(ms:number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


//---- SUBMIT TX

const RPC_SERVER = process.env.STELLAR_SOROBAN
//const RPC_SERVER = "https://rpc-futurenet.stellar.org:443";
//const RPC_SERVER = "https://soroban-testnet.stellar.org/";
console.log('RPC', RPC_SERVER)
const server = new SorobanRpc.Server(RPC_SERVER);

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

async function submitTx(tx:Transaction) {
  try {
    let response = await server.sendTransaction(tx);
    console.log(`Sent transaction: ${JSON.stringify(response)}`);
    let txid = response.hash

    if (response.status === "PENDING") {
      let result = await server.getTransaction(response.hash);
      // Poll `getTransaction` until the status is not "NOT_FOUND"
      while (result.status === "NOT_FOUND") {
        console.log("Waiting for transaction confirmation...");
        // See if the transaction is complete
        result = await server.getTransaction(response.hash);
        // Wait two seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      //console.log(`getTransaction response: ${JSON.stringify(result)}`);
      console.log(`Status:`, result.status);
      if (result.status === "SUCCESS") {
        // Make sure the transaction's resultMetaXDR is not empty
        if (!result.resultMetaXdr) {
          console.log('Error: Empty resultMetaXDR')
          throw "Empty resultMetaXDR in getTransaction response";
        }
        // Find the return value from the contract and return it
        let transactionMeta = result.resultMetaXdr;
        let returnValue = result.returnValue;
        console.log('Return value:', JSON.stringify(returnValue,null,2));
        //console.log(`Return value: ${returnValue}`);
        return {success:true, value:returnValue, meta:transactionMeta, txid};
      } else {
        //console.log('RESULTX:', JSON.stringify(result,null,2));
        console.log('ERROR IN TRANSACTION:', JSON.stringify(result.resultXdr,null,2));
        throw `Transaction failed: ${result.resultXdr}`;
      }
    } else {
      console.log('ERROR IN RESPONSE')
      throw response.errorResult;
    }
  } catch (err:any) {
    // Catch and report any errors we've thrown
    console.log("Sending transaction failed");
    console.log('Error:', err);
    console.log(JSON.stringify(err));
    return {success:false, error:err.message};
  }
}

//---- RESTORE

// assume that `server` is the Server() instance from the preamble
async function submitOrRestoreAndRetry(signer: Keypair, tx: Transaction) {
  // We can't use `prepareTransaction` here because we want to do
  // restoration if necessary, basically assembling the simulation ourselves.
  const sim = await server.simulateTransaction(tx);

  // Other failures are out of scope of this tutorial.
  if (!Api.isSimulationSuccess(sim)) {
    console.log('Error simulating')
    throw sim;
  }

  // If simulation didn't fail, we don't need to restore anything! Just send it.
  if (!Api.isSimulationRestore(sim)) {
    console.log('No contract restore needed')
    //const prepTx = assembleTransaction(tx, sim);
    //console.log(prepTx)
    //prepTx.sign(signer);

    let prepTx = await server.prepareTransaction(tx);
    console.log('PREPTX',prepTx)
    prepTx.sign(signer)
    console.log('SIGNTX',prepTx)
    const rest = await submitTx(prepTx)
    console.log(rest)
    return rest
  }

  //
  // Build the restoration operation using the RPC server's hints.
  //
  console.log('Restore Contract...')
  const account = await server.getAccount(signer.publicKey());
  let fee = parseInt(BASE_FEE);
  fee += parseInt(sim.restorePreamble.minResourceFee);

  const restoreTx = new TransactionBuilder(account, { fee: fee.toString() })
    .setNetworkPassphrase(tx.networkPassphrase)
    .setSorobanData(sim.restorePreamble.transactionData.build())
    .addOperation(Operation.restoreFootprint({}))
    .setTimeout(30)
    .build();

  restoreTx.sign(signer);

  const resp = await submitTx(restoreTx);
  console.log({resp})
  //if (resp?.status !== Api.GetTransactionStatus.SUCCESS) {
  if (!resp?.success) {
    //throw resp;
    console.log('Error restoring contract', resp)
    return {success:false, error:'Error restoring contract'}
  }

  //
  // now that we've restored the necessary data, we can retry our tx using
  // the initial data from the simulation (which, hopefully, is still
  // up-to-date)
  //
  const retryTxBuilder = TransactionBuilder.cloneFrom(tx, {
    fee: (parseInt(tx.fee) + parseInt(sim.minResourceFee)).toString(),
    sorobanData: sim.transactionData.build(),
  });

  // because we consumed a sequence number when restoring, we need to make sure we set the correct value on this copy
  // @ts-ignore: types suck donkey balls
  retryTxBuilder?.source?.incrementSequenceNumber();

  const retryTx = retryTxBuilder.build();
  retryTx.sign(signer);

  const resx = await submitTx(retryTx);
  console.log('Restored?', resx)
  return resx
}

//---- RESTORE

async function restoreContract(signer:Keypair, c:Contract, network:any){
  const instance = c.getFootprint();
  const account = await server.getAccount(signer.publicKey());
  const wasmEntry = await server.getLedgerEntries(getWasmLedgerKey(instance));
  // @ts-ignore: types suck donkey balls
  const data = new SorobanDataBuilder().setReadWrite([instance, wasmEntry]).build();
  const restoreTx = new TransactionBuilder(account, { fee: BASE_FEE })
    .setNetworkPassphrase(network.passphrase)
    .setSorobanData(data) // Set the restoration footprint (remember, it should be in the read-write part!)
    .addOperation(Operation.restoreFootprint({}))
    .build();

  const preppedTx = await server.prepareTransaction(restoreTx);
  preppedTx.sign(signer);
  return submitTx(preppedTx);
}

function getWasmLedgerKey(entry: any) {
  const hash = entry.val().instance().wasmHash()
  const key = { hash }
  const code = new xdr.LedgerKeyContractCode(key)
  const res = xdr.LedgerKey.contractCode(code)
  return res
}

//---- RUN

export async function submit(network:any, secret:string, contractId:string, method:string, args:any) {
  const source   = Keypair.fromSecret(secret)
  //const server   = new SorobanRpc.Server(network.soroban)
  const contract = new Contract(contractId)
  const account  = await server.getAccount(source.publicKey())
  console.log('SUBMIT', {network, contractId, method, args})

  let op = contract.call(method, ...args)
  let tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: network.passphrase })
    .addOperation(op)
    .setTimeout(30)
    .build()

  try {
    const resp = await submitOrRestoreAndRetry(source, tx)
    console.log('RESP', resp)
    if(resp.success){
      const meta:any = resp.meta
      //console.log('META', JSON.stringify(meta,null,2))
      const lastId = meta?._value?._attributes?.sorobanMeta?._attributes?.events[0]?._attributes?.body?._value?._attributes?.data?._value?._attributes?.lo?._value?.toString() || ''
      const tokenId = lastId ? (contractId + ' #' + lastId) : resp.txid
      console.log('TOKENID', tokenId)
      return {success:true, tokenId, error:null}
    } else {
      return {success:false, tokenId:'', error:'Error minting NFT'}
    }
  } catch (err:any) {
    // Catch and report any errors we've thrown
    console.log("Error sending transaction", err);
    return {success:false, tokenId:'', error:err.message||'Error minting NFT'}
  }
}

export async function checkContract(network:any, secret:string, contractId:string, method:string, args:any) {
  const source   = Keypair.fromSecret(secret)
  //const server   = new SorobanRpc.Server(network.soroban)
  const contract = new Contract(contractId)
  const account  = await server.getAccount(source.publicKey())
  console.log({network, contractId, method, args})

  let op = contract.call(method, ...args)
  let tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: network.passphrase })
    .addOperation(op)
    .setTimeout(30)
    .build()

  const sim = await server.simulateTransaction(tx);
  if (!Api.isSimulationSuccess(sim)) {
    throw sim
  }
  if (Api.isSimulationRestore(sim)) {
    console.log('Contract needs to be restored')
    const result = await restoreContract(source, contract, network)
    console.log('RESULT', result)
    return {ready:true}
  } else {
    console.log('Contract is ready')
    return {ready:true}
  }
}

