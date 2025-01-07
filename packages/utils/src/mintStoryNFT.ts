// @ts-ignore turbo should error out if these are not set
// const XDCSDK = new XDCServer({ walletSeed: process.env.XDC_MINTER_SECRET, network: process.env.XDC_NETWORK });

import appConfig from "@cfce/app-config"
import { BlockchainServerInterfaces } from "@cfce/blockchain-tools"
//import { BlockchainManager } from "@cfce/blockchain-tools"
import { getTokenBoundAccount } from "@cfce/database"
import { EntityType } from "@cfce/types"

const uuidToUint256 = (uuid: string) => {
  const hex = uuid.replace(/-/g, "")
  const bigIntUUID = BigInt(`0x${hex}`)
  // Since UUID is 128-bit, we shift it left by 128 places to fit into a 256-bit space
  const uint256 = bigIntUUID << BigInt(128)
  return uint256
}

/**
 * Given a story ID, mint an NFT for the story
 * @param storyId Story ID from registry db
 * @param tokenCID CID from IPFS
 * @param owner Address of TBA account
 */
export async function mintStoryNFT(storyId: string, tokenCID: string, initiativeId: string) {
  const chainSlug = 'xdc'
  const network = 'testnet'
  const uint256 = uuidToUint256(storyId)
  const tbaRec = await getTokenBoundAccount(EntityType.initiative, initiativeId, chainSlug, network)
  const address = tbaRec?.account_address // || appConfig.chains?.xdc?.wallet // mint to initiative TBA address
  const contractId = appConfig.chains?.xdc?.contracts?.storyERC1155
  const walletSeed = process.env.XDC_WALLET_SECRET
  console.log({ uint256, tokenCID, contractId, address })

  if (!address || !contractId || !walletSeed) {
    throw new Error("Missing wallet or contract info")
  }

  //const serverInterface = BlockchainManager.xdc.server
  const serverInterface = BlockchainServerInterfaces.evm
  serverInterface.setChain("xdc")

  const response = await serverInterface.mintNFT1155({
    address,
    uri: `${uint256}`,
    tokenId: tokenCID,
    contractId,
    walletSeed,
  })
  if ("error" in response) {
    throw new Error(response.error)
  }

  console.log("Minted NFT", response.txId, response.tokenId)
  return response
}
