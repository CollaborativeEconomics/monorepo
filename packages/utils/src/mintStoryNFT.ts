// @ts-ignore turbo should error out if these are not set
// const XinFinSDK = new XinFinServer({ walletSeed: process.env.XINFIN_MINTER_SECRET, network: process.env.XINFIN_NETWORK });

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
  const address = process.env.XINFIN_MINTER_WALLET
  const contractId = process.env.XINFIN_NFT1155_CONTRACT
  const walletSeed = process.env.XINFIN_MINTER_SECRET
  console.log({ uint256, tokenCID, contractId, address })

  if (!address || !contractId || !walletSeed) {
    throw new Error("Missing wallet or contract info")
  }

  const response = await BlockchainManager.xinfin.server.mintNFT1155({
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
