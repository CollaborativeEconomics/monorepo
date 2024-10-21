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
