import { type Address, getContract, createPublicClient, createWalletClient, http, custom, type TransactionReceipt } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { xdc, xdcTestnet } from 'viem/chains'
import appConfig from '@cfce/app-config'
import { abi721, abi6551registry as registryABI, BlockchainManager, BlockchainServerInterfaces, chainConfig } from '@cfce/blockchain-tools'
import { newTokenBoundAccount, getTokenBoundAccount } from '@cfce/database'
import type { EntityType } from '@cfce/types'

/* TBAS - Token Bound Accounts ERC 6551

  Used to create and attach a contract account to an NFT (address + token id)
  
  Methods used:

  - createAccount(tokenContract, tokenId, chainId, waitForReceipt=false)
    returns the address of the newly created TBA

  - getAccount(tokenContract, tokenId, chainId)
    returns the address of a TBA generated for an NFT and token Id on any blockchain

*/

const chainSlug = "xdc"
//const network = process.env.NEXT_PUBLIC_APP_ENV==='production' ? 'mainnet' : 'testnet'
const network = appConfig.chainDefaults.network
const settings = chainConfig.xdc.networks[network]
//console.log('SET', settings)
const chainId = settings.id.toString()
const registryAddress = (settings.contracts?.tba6551RegistryAddress ||
  "0x0") as Address
const implementationAddress = (settings.contracts
  ?.tba6551ImplementationAddress || "0x0") as Address
const tokenContract = settings.contracts?.tba721TokenContract || "0x0"
const baseSalt =
  "0x0000000000000000000000000000000000000000000000000000000000000001" as Address

const serverInterface = BlockchainServerInterfaces.evm
serverInterface.setChain("xdc")

/*
interface ChainSettings {
  chain: string
  chainId: string
  rpcUrl: string
  registryAddress: string
  implementationAddress: string
  tokenContract: string
  baseSalt: string
}

function getSettings_OLD(net:string){
  const Settings:Record<string, ChainSettings> = {
    'mainnet': {
      chain: 'xdc',
      chainId: '50',
      rpcUrl: 'https://rpc.xdcrpc.com',
      registryAddress : '0x000000006551c19487814612e58fe06813775758',
      implementationAddress : '0x41c8f39463a868d3a88af00cd0fe7102f30e44ec',
      tokenContract: '0xcbbb500f1cf1d6c44b0d7c9ff40292f8a0e756d7',
      baseSalt: '0x0000000000000000000000000000000000000000000000000000000000000001'
    },
    'testnet': {
      chain: 'xdc',
      chainId: '51',
      rpcUrl: 'https://erpc.apothem.network',
      registryAddress : '0x000000006551c19487814612e58fe06813775758',
      implementationAddress : '0x41c8f39463a868d3a88af00cd0fe7102f30e44ec',
      tokenContract: '0xcbbb500f1cf1d6c44b0d7c9ff40292f8a0e756d7',
      baseSalt: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }
  }
  return Settings[net]
}
*/

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function newClient() {
  // RPC server
  const chain = network === "mainnet" ? xdc : xdcTestnet
  const rpcUrl = chain.rpcUrls.default.http[0]
  //const rpcUrl = 'https://rpc.apothem.network'
  //const rpcUrl = 'https://erpc.apothem.network'
  console.log("URL", rpcUrl)
  const publicClient = createPublicClient({ chain, transport: http(rpcUrl) })
  // Metamask, use only in client
  //const walletClient = createWalletClient({ chain, transport: custom(window?.ethereum) })
  const walletClient = createWalletClient({ chain, transport: http(rpcUrl) })
  return { public: publicClient, wallet: walletClient }
}

/*
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
    console.log('OK', receipt?.status)
    console.log('REC', receipt)
    return receipt
  }
  return null
}
*/

// @ts-ignore turbo should error out if these are not set
// const XDCSDK = new XDCServer({ walletSeed: process.env.XDC_WALLET_SECRET });
const uuidToUint256 = (uuid: string) => {
  const hex = uuid.replace(/-/g, "")
  const bigIntUUID = BigInt(`0x${hex}`)
  // Since UUID is 128-bit, we shift it left by 128 places to fit into a 256-bit space
  //const uint256 = bigIntUUID << BigInt(128)
  const uint256 = bigIntUUID // no shift
  return uint256
}

/**
 * Given an entity ID, mint a TBA NFT for the entity
 * If parentId exists, mint NFT to parent, not to server account
 * @param entityId UUID from registry db
 * @param parentId UUID from registry db
 */
export async function mintTBAccountNFT(entityId: string, parentAddress?: string) {
  const walletSeed = process.env.XDC_WALLET_SECRET
  const address = parentAddress || settings.wallet // parent or server wallet
  const contractId = tokenContract
  const tokenId = uuidToUint256(entityId).toString()
  console.log("MINTER", address)
  console.log("CONTRACT", contractId)
  console.log("ENTITY", entityId)
  console.log("TOKEN", tokenId)

  if (!address || !contractId || !walletSeed) {
    throw new Error("Missing wallet or contract info")
  }

  const response = await serverInterface.mintNFT721({
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

// Create token bound account from implementation
export async function createTBAccount(
  tokenContract: string,
  tokenId: string,
  chainId: string,
  waitForReceipt = false,
) {
  console.log("Creating account...")
  const privateKey = process.env.XDC_WALLET_SECRET || ""
  if (!privateKey) {
    return {
      status: "error",
      txid: "",
      address: "",
      error: "Private key not found",
    }
  }
  try {
    const client = newClient()
    const serverAccount = privateKeyToAccount(privateKey as Address)
    const contract = getContract({
      client,
      abi: registryABI,
      address: registryAddress,
    })

    // Simulate
    const { request } = await client.public.simulateContract({
      account: serverAccount,
      address: registryAddress,
      abi: registryABI,
      functionName: "createAccount",
      args: [
        implementationAddress,
        baseSalt,
        BigInt(chainId),
        tokenContract as Address,
        BigInt(tokenId),
      ],
    })

    // Send to chain
    const txid = await client.wallet.writeContract(request)
    console.log("TXID", txid)

    // Tx receipt
    if (waitForReceipt) {
      const receipt = await client.public.waitForTransactionReceipt({
        hash: txid,
      })
      if (!receipt) {
        return { status: "notfound", txid, address: "", error: "" }
      }
      if (receipt.status === "success") {
        const address = `0x${receipt?.logs[0].data.substr(26, 40)}`
        console.log("TBA", address, receipt.status)
        return { status: receipt.status, txid, address, error: "" }
      }
      return { status: receipt.status, txid, address: "", error: "" }
    }
    return { status: "pending", txid, address: "", error: "" }
    // biome-ignore lint/suspicious/noExplicitAny: any error
  } catch (ex: any) {
    console.error(ex)
    return { status: "error", txid: "", address: "", error: ex.message }
  }
}

// Get account address from contract
export async function fetchTBAccount(tokenContract:string, tokenId:string, chainId:string){
  console.log('Getting account...', tokenContract, tokenId, chainId)
  const client = newClient()
  const contract = getContract({
    client: client.public,
    abi: registryABI,
    address: registryAddress,
  })
  const address =
    (await contract.read.account([
      implementationAddress,
      baseSalt,
      BigInt(chainId),
      tokenContract as Address,
      BigInt(tokenId),
    ])) || ""
  console.log("TBA", address)
  return address
}

/*
  - Mints NFT to hold the TBA
  - Prefetches TBA address
  - Creates TBA contract
  - Saves TBA to DB
*/
export async function newTBAccount(entity_type:string, entity_id:string, parent_id?: string){
  try {
    let parent_address = ''
    if(parent_id){
      const tbaRec = await getTokenBoundAccount(entity_type, entity_id, chainSlug, network)
      parent_address = tbaRec?.account_address || ''
    }
    const resMint = await mintTBAccountNFT(entity_id, parent_address) // mint nft for tba in main/parent 721 contract
    console.log('NFT', resMint)
    const tokenId = resMint.tokenId
    console.log("TokenID", tokenId)
    // create token bound account for user in xdc
    const account_address:string = await fetchTBAccount(tokenContract, tokenId, chainId) // prefetch account address
    console.log('ACCT', account_address)
    const resTBA = await createTBAccount(tokenContract, tokenId, chainId, true)
    console.log("TBA", resTBA)
    //const address = resTBA.address
    // add tba record to db
    if(resTBA){
      const data = {entity_type, entity_id, account_address, parent_address, chain: chainSlug, network}
      const resDB = await newTokenBoundAccount(data)
      console.log("DB", resDB)
    }
    return account_address
    // biome-ignore lint/suspicious/noExplicitAny: any error
  } catch (ex: any) {
    console.error(ex)
    return null
  }
}

// END
