// Mints NFT and returns tokenId
//   metauri: uri to metadata
import { Address } from "@stellar/stellar-sdk"
import { networks } from "@/src/contracts/networks"
import { submit } from "@/src/contracts/nft721/server"

export default async function mint(
  contractId: string,
  to: string,
  uri: string,
) {
  console.log("-- Minting...")
  console.log("TO", to)
  console.log("URI", uri)
  try {
    const nettype = process.env.NEXT_PUBLIC_STELLAR_NETWORK || ""
    // @ts-ignore: I hate this
    const network =
      nettype === "mainnet" ? networks?.mainnet : networks?.testnet
    console.log("NET", network)
    const secret = process.env.CFCE_MINTER_WALLET_SECRET || ""
    const method = "mint"
    const args = [new Address(to).toScVal()] // use nativeToScVal for other values
    const result = await submit(network, secret, contractId, method, args)
    //console.log('RES', result)
    console.log("OK?", result?.success)
    console.log("TOKENID", result?.tokenId)
    //console.log('RESULT', result?.result)
    return result
  } catch (ex) {
    console.error(ex)
    if (ex instanceof Error) {
      return { success: false, error: ex.message }
    }
    return { success: false, error: "Error minting NFT" }
  }
}

/* OLD JAN 2024

import * as StellarSdk from 'stellar-sdk'
import { networks } from '@/contracts/networks'
import { Contract } from '@/contracts/nft721/client'

interface MintResponse {
  success?: boolean;
  error?:string|boolean;
  id?:string;
}

export default async function mint(adr, uri){
  console.log('-- Minting...')
  console.log('ADR', adr)
  console.log('URI', uri)
  const nettype = process.env.NEXT_PUBLIC_STELLAR_NETWORK
  const network = nettype=='mainnet' ? networks.mainnet : networks.testnet
  console.log('NET', network)
  const contract = new Contract({...network})
  //console.log('CTR', contract.spec)
  const res = await contract.mint({to:adr})
  console.log('OK?', res?.success)
  console.log('TXID', res?.txid)
  console.log('TOKENID', res?.result)
  // https://horizon-futurenet.stellar.org/transactions/1308c09ac21ef54c45b219d53fcb97ab9048e662d06a56af2407bcab63ebea86
  //{
  //  status: 'PENDING',
  //  hash: '9c49b24c8b2071d37bf801500708ab7e7fddf30015124908428144253f5f39be',
  //  latestLedger: '708121',
  //  latestLedgerCloseTime: '1698523520'
  //}
  return res
}

*/

/*
//export default async function mintNFT(account:string, metauri: string):Promise<MintResponse>{
async function mintOLD(account:string, metauri: string):Promise<MintResponse>{
  console.log('Minting...', account, metauri)
  try {
    const server  = new StellarSdk.Server(process.env.STELLAR_HORIZON)
    const minter  = StellarSdk.Keypair.fromSecret(process.env.CFCE_MINTER_WALLET_SEED) // GDXMQP...
    const issuer  = minter.publicKey()
    const source  = await server.loadAccount(issuer)
    const myNFT   = new StellarSdk.Asset('GIVEXLM', issuer)
    //const phrase  = process.env.STELLAR_NETWORK=='mainnet' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET
    const phrase  = process.env.STELLAR_PASSPHRASE
    const timeout = 300 // five minutes

    var mintTx = new StellarSdk.TransactionBuilder(source, {
      networkPassphrase: phrase,
      fee: StellarSdk.BASE_FEE
    })

    let mintOp = StellarSdk.Operation.payment({
      source: issuer,
      destination: account,
      asset: myNFT,
      amount: '1'
    })

    let mint = mintTx
      .addOperation(mintOp)
      //.addMemo(StellarSdk.Memo.text(metauri))
      .setTimeout(timeout)
      .build()
    
    //console.log('Minting...')
    mint.sign(minter)
    let minted = await server.submitTransaction(mint)
    console.log('Minted', minted)
    if(minted?.successful){
      // StellarSDK interface from server.submitTransaction response without paging_token
      // Clone the result and get the paging_token from there
      const cloned = JSON.parse(JSON.stringify(minted))
      const opid = (BigInt(cloned?.paging_token || '0') + BigInt(1)).toString() // eslint-disable-line
      console.log('Txid', opid)
      return {success:true, id:opid}
    } else {
      //console.log('Error', minted.response?.data?.extras?.result_codes)
      //return {success:false, error:'Error minting '+minted?.response?.data?.extras?.result_codes}
      //console.log('Error?', minted?.response?.data)
      console.log('Error?', minted)
      return {success:false, error:'Error minting NFT'}
    }
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
*/

/*
async function mintSoroban(account:string, metauri: string) {
  const rpcURL = '???'
  const contractId = '???'
  //const minter = '???'
  const minter = StellarSdk.Keypair.fromSecret(process.env.CFCE_MINTER_WALLET_SEED) // GDXMQPQAPJ2UYPTNC53ZQ756TIIGFWVDRAP2QEWK6KVBRHXE3DJMLDEG
  const pubkey = minter.publicKey()
  const fee = '100'
  const networkPassphrase = '???'
  const method = 'mint'
  const args = ['???']

  const server = new SorobanClient.Server(rpcUrl, {allowHttp: rpcUrl.startsWith("http://")})
  const source = new SorobanClient.Account(pubkey, "0")
  const contract = new SorobanClient.Contract(contractId)

  let tx = new SorobanClient.TransactionBuilder(source, {fee, networkPassphrase})
      .addOperation(contract.call(method, ...args))
      .setTimeout(SorobanClient.TimeoutInfinite)
      .build()
  //tx = await signTx(wallet, SorobanClient.assembleTransaction(tx, networkPassphrase, simulated).build(), networkPassphrase);
  tx.sign(minter, networkPassphrase)
  const sendTransactionResponse = await server.sendTransaction(tx)
  return sendTransactionResponse
  if (responseType === "full") {
      return raw;
  }
  // if `sendTx` awaited the inclusion of the tx in the ledger, it used
  // `getTransaction`, which has a `resultXdr` field
  if ("resultXdr" in raw) {
      const getResult = raw;
      if (getResult.status !== SorobanClient1.SorobanRpc.GetTransactionStatus.SUCCESS) {
          console.error('Transaction submission failed! Returning full RPC response.');
          return raw;
      }
      return parse(raw.resultXdr.result().toXDR("base64"));
  }
  // otherwise, it returned the result of `sendTransaction`
  if ("errorResultXdr" in raw) {
      const sendResult = raw;
      return parse(sendResult.errorResultXdr);
  }
  // if neither of these are present, something went wrong
  console.error("Don't know how to parse result! Returning full RPC response.");
  return raw;
}
*/

// END
