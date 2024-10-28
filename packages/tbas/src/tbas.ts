import "server-only"
import { type Address, getContract, createPublicClient, createWalletClient, http, custom, type TransactionReceipt } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { xdcTestnet as chain } from 'viem/chains'
import { abi721, abi6551registry, BlockchainManager } from '@cfce/blockchain-tools'
import type { EntityType } from '@cfce/types'
//import { newAccount } from "@cfce/database"

/* TBAS - Token Bound Accounts ERC 6551

  Used to create and attach a contract account to an NFT (address + token id)
  
  Methods used:

  - createAccount(tokenContract, tokenId, chainId, waitForReceipt=false)
    returns the address of the newaly created TBA

  - getAccount(tokenContract, tokenId, chainId)
    returns the address of a TBA generated for an NFT and token Id on any blockchain

*/

// Move to types/global.d.ts
declare global {
  interface Window {
    ethereum: any
  }
}


// Move to config.ts 
const settings = {
  privateKey : process.env.XINFIN_WALLET_SECRET || '0x0',
  registryAddress : '0x000000006551c19487814612e58FE06813775758',
  implementationAddress : '0x41C8f39463A868d3A88af00cd0fe7102F30E44eC',
  tokenContract: '0xdFDf018665F2C5c18a565ce0a2CfF0EA2187ebeF',
  baseSalt: '0x0000000000000000000000000000000000000000000000000000000000000001'
}

function sleep(ms:number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function newClient(){
  // RPC server
  const rpcUrl = chain.rpcUrls.default.http[0]
  console.log('URL', rpcUrl)
  const publicClient = createPublicClient({ chain, transport: http(rpcUrl) }) 
  // Metamask, use only in client
  const walletClient = createWalletClient({ chain, transport: custom(window?.ethereum) })
  return {public: publicClient, wallet: walletClient }
}
 

async function getReceipt(txid:string){
  console.log('Getting receipt for tx', txid)
  const client = newClient()
  let receipt:TransactionReceipt | undefined;
  let count = 0
  while(!receipt || count < 10){
    count += 1
    console.log('TRY', count)
    await sleep(3000) // TODO: incremental sleep
    receipt = await client.public.getTransactionReceipt({ hash: txid as Address })
    if(!receipt){ continue }
    //console.log('REC', receipt)
    console.log('OK', receipt?.status)
    return receipt
  }      
  return null
}

async function mainAccount(){
  const client = newClient()
  const accounts = await client.wallet.requestAddresses()
  const mainAccount = accounts[0]
  console.log('ACCOUNT', mainAccount)
  console.log('CHAIN', chain.id)
  return mainAccount
}

// Create token bound account from implementation
export async function createAccount(tokenContract:string, tokenId:string, chainId:string, waitForReceipt=false){
  console.log('Creating account...')
  if(!settings.privateKey || settings.privateKey==='0x0'){
    return { status: 'error', txid:'', address:'', error:'private key not found' }
  }
  try {
    const client = newClient()
    const serverAccount = privateKeyToAccount(settings.privateKey as Address)
    const contract = getContract({
      client,
      abi: abi6551registry,
      address: settings.registryAddress as Address
    })

    // Simulate
    const { request } = await client.public.simulateContract({
      account: serverAccount,
      address: settings.registryAddress as Address,
      abi: abi6551registry,
      functionName: 'createAccount',
      args: [settings.implementationAddress as Address, settings.baseSalt as Address, BigInt(chainId), tokenContract as Address, BigInt(tokenId)],
    })

    // Send to chain
    const txid = await client.wallet.writeContract(request)
    console.log('TXID', txid)

    // Tx receipt
    if(waitForReceipt){
      const receipt = await getReceipt(txid)
      if(!receipt){
        return { status: 'notfound', txid, address:'', error:'' }
      }
      if(receipt.status==='success'){
        const address = `0x${receipt?.logs[0].data.substr(26,66)}`
        console.log('TBA', address, receipt.status)
        return { status: receipt.status, txid, address, error:'' }
      }
      return { status: receipt.status, txid, address:'', error:'' }
    }
    return { status: 'pending', txid, address:'', error:'' }
  } catch(ex:any) {
    console.error(ex)
    return { status: 'error', txid:'', address:'', error:ex.message }
  }
}

// Get account address from contract
export async function getAccount(tokenContract:string, tokenId:string, chainId:string){
  console.log('Getting account...')
  const client = newClient()
  const contract = getContract({
    client: client.public,
    abi: abi6551registry,
    address: settings.registryAddress as Address
  })
  const address = await contract.read.account([
    settings.implementationAddress as Address,
    settings.baseSalt as Address,
    BigInt(chainId),
    tokenContract as Address,
    BigInt(tokenId)
  ])
  console.log('TBA', address)
  return address
}


export async function newTokenBoundAccount(entityType:string, entityId:string){
  try {
    // TODO: move to config?
    const chain = 'xdc' // XDC TESTNET APOTHEM
    const chainId = '51'
    const network = 'testnet'
    const tokenContract = '0xdFDf018665F2C5c18a565ce0a2CfF0EA2187ebeF'
    // mint nft for tba in main 721 contract
    const resMint = await mintAccountNFT(entityId) // <<<<< 
    console.log('NFT', resMint)
    const tokenId = resMint.tokenId
    console.log('TokenID', tokenId)
    // create token bound account for user in xdc
    const resTBA = await createAccount(tokenContract, tokenId, chainId)
    console.log('TBA', resTBA)
    const address = resTBA.address
    // add tba record to db
    if(resTBA){
      //const resDB = await newAccount(entityType, entityId, address, chain, network)
      //console.log('DB', resDB)
    }
    return address
  } catch(ex:any) {
    console.error(ex)
    return null
  }
}



// @ts-ignore turbo should error out if these are not set
// const XinFinSDK = new XinFinServer({ walletSeed: process.env.XINFIN_MINTER_SECRET, network: process.env.XINFIN_NETWORK });


const uuidToUint256 = (uuid: string) => {
  const hex = uuid.replace(/-/g, "")
  const bigIntUUID = BigInt(`0x${hex}`)
  // Since UUID is 128-bit, we shift it left by 128 places to fit into a 256-bit space
  const uint256 = bigIntUUID << BigInt(128)
  return uint256
}

/**
 * Given a entity ID, mint a TBA NFT for the entity
 * @param entityId UUIID from registry db
 * @param tokenCID CID from IPFS
 */
export async function mintAccountNFT(entityId: string) {
  const address = process.env.XINFIN_MINTER_WALLET
  const contractId = process.env.XINFIN_NFT6551_CONTRACT // 0xcBbB500f1CF1D6C44B0d7C9ff40292f8a0E756D7
  const walletSeed = process.env.XINFIN_MINTER_SECRET
  const tokenId = uuidToUint256(entityId).toString()
  console.log({ contractId, address, tokenId })

  if (!address || !contractId || !walletSeed) {
    throw new Error("Missing wallet or contract info")
  }

  const response = await BlockchainManager.xinfin.server.mintNFT721({
    address,
    tokenId,
    contractId,
    walletSeed,
  })
  if ("error" in response) {
    throw new Error(response.error)
  }
  console.log("Minted NFT", response.txId, response.tokenId)
  return response
}


// END