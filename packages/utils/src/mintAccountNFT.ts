import { BlockchainServerInterfaces } from "@cfce/blockchain-tools"

//const serverInterface = BlockchainManager.xdc.server
const serverInterface = BlockchainServerInterfaces.evm
serverInterface.setChain("xdc")

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
 */

export async function mintAccountNFT(entityId: string) {
  const address = process.env.XDC_WALLET_ADDRESS
  const walletSeed = process.env.XDC_WALLET_SECRET
  const contractId = process.env.XDC_NFT6551_CONTRACT // 0xcBbB500f1CF1D6C44B0d7C9ff40292f8a0E756D7
  const tokenId = uuidToUint256(entityId).toString()
  const metadataUri = "" // TODO: no metadata for user ?
  console.log({ contractId, address, tokenId })

  if (!address || !contractId || !walletSeed) {
    throw new Error("Missing wallet or contract info")
  }

  const response = await serverInterface.mintNFT721TBA({
    address,
    tokenId,
    contractId,
    walletSeed,
    metadataUri,
  })
  if ("error" in response) {
    throw new Error(response.error)
  }
  console.log("Minted NFT", response.txId, response.tokenId)
  return response
}
