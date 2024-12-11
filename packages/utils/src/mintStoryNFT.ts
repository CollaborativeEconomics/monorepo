// @ts-ignore turbo should error out if these are not set
// const XDCSDK = new XDCServer({ walletSeed: process.env.XDC_MINTER_SECRET, network: process.env.XDC_NETWORK });

import { posthogNodeClient } from "@cfce/analytics"
import { BlockchainManager } from "@cfce/blockchain-tools"

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
 */
export async function mintStoryNFT(storyId: string, tokenCID: string) {
  const uint256 = uuidToUint256(storyId)
  const address = process.env.XDC_WALLET_ADDRESS
  const contractId = process.env.XDC_NFT1155_CONTRACT
  const walletSeed = process.env.XDC_WALLET_SECRET
  console.log({ uint256, tokenCID, contractId, address })

  if (!address || !contractId || !walletSeed) {
    throw new Error("Missing wallet or contract info")
  }

  const response = await BlockchainManager.xdc.server.mintNFT1155({
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
