// Mints NFT and returns tokenId
//   metauri: uri to metadata
import appConfig from "@cfce/app-config"
import { Address } from "@stellar/stellar-sdk"
import { networks } from "~/contracts/networks"
import { submit } from "~/contracts/nft721/server"

export default async function mint(
  contractId: string,
  to: string,
  uri: string,
) {
  console.log("-- Minting...")
  console.log("TO", to)
  console.log("URI", uri)
  try {
    const nettype =
      appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network
    // @ts-ignore: I hate this
    const network =
      nettype === "mainnet" ? networks?.mainnet : networks?.testnet
    console.log("NET", network)
    const secret = process.env.STELLAR_WALLET_SECRET || ""
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
