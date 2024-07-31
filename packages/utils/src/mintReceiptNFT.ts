// import upload from "@/src/libs/nft/upload"
// import mint from "@/src/libs/nft/mint"
// import fetchLedger from "@/src/libs/server/fetchLedger"
import {
  BlockchainManager,
  type ChainSlugs,
  type TokenTickerSymbol,
  getCryptoPriceQuote,
} from "@cfce/blockchain-tools"
import {
  ReceiptStatus,
  getInitiativeById,
  getOrganizationById,
  getUserByWallet,
  newNftData,
} from "@cfce/database"
import { Triggers, runHook } from "@cfce/registry-hooks"
import { DateTime } from "luxon"
import appConfig from "./appConfig"
import { uploadDataToIPFS } from "./ipfs"

interface mintReceiptNFTParams {
  transaction: {
    txId: string
    chain: ChainSlugs
    token: TokenTickerSymbol
  }
  initiativeId: string
  donorWalletAddress: string
  amount: number
  rate: number
}

export async function mintReceiptNFT({
  transaction: { txId, chain, token },
  initiativeId,
  donorWalletAddress,
  amount,
}: mintReceiptNFTParams) {
  try {
    const chainTool = BlockchainManager.getInstance()[chain]?.server
    if (!chainTool) {
      console.error("No chain tool found for chain", chain)
      return { success: false, error: "No chain tool found for chain" }
    }
    // Verify that the transaction is valid
    const txInfo = await chainTool.getTransactionInfo(txId)
    if ("error" in txInfo) {
      console.log("ERROR", "Transaction not found")
      throw new Error(`Transaction not found: ${txInfo.error}`)
    }

    const created = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss")

    // Get user data
    console.log("Donor", donorWalletAddress)
    const user = await getUserByWallet(donorWalletAddress) // Should exist user by now
    //console.log('USER', user)
    const userId = user?.id || ""
    if (!userId) {
      console.log("ERROR", "User not found")
      throw new Error("User not found")
    }

    // Get initiative info
    const initiative = await getInitiativeById(initiativeId)
    //console.log('INITIATIVE', initiative)
    if (!initiative) {
      console.log("ERROR", "Initiative not found")
      throw new Error("Initiative info not found")
    }
    const initiativeName = initiative.title || "Direct Donation"

    // Get organization info
    const organizationId = initiative.organizationId
    const organization = await getOrganizationById(organizationId)
    //console.log('ORGANIZATION', organization)
    if (!organization) {
      console.log("ERROR", "Organization not found")
      throw new Error("Organization not found")
    }
    const organizationName = organization?.name

    const rate = await getCryptoPriceQuote(token) //, chain) <- TODO: test this
    const amountCUR = (+amount).toFixed(4)
    const amountUSD = (+amount * rate).toFixed(4)

    // runHook takes 3 params. 1. The Trigger name 2. The organizations to check and 3. Additional data that can be used by the the hook
    const extraMetadata = await runHook(
      Triggers.addMetadataToNFTReceipt,
      `${organizationId}`,
      {
        userId: `${userId}`,
        donor: `${donorWalletAddress}`,
        amountUSD: `${amountUSD}`,
      },
    )
    console.log("EXTRA:", extraMetadata)

    let offsetVal = 0
    let offsetTxt = "0 Tons"
    console.log("CREDIT", initiative?.credits)
    if (initiative?.credits?.length > 0) {
      const creditVal = initiative?.credits?.[0]?.value ?? 0
      const creditTon = creditVal / (rate || 1)
      offsetVal = creditTon > 0 ? +amountUSD / creditTon : 0
      if (offsetVal < 0.00005) {
        offsetVal = 0.0001
      } // Round up
      offsetTxt = `${offsetVal.toFixed(4)} Tons`
      console.log("CREDITVAL", creditVal)
      console.log("CREDITTON", creditTon)
      console.log("OFFSETVAL", offsetVal)
      console.log("OFFSETTXT", offsetTxt)
    }

    const uriImage =
      initiative?.imageUri ||
      "ipfs:QmZWgvsGUGykGyDqjL6zjbKjtqNntYZqNzQrFa6UnyZF1n"
    //const uriImage = 'ipfs:QmdmPTsnJr2AwokcR1QC11s1T3NRUh9PK8jste1ngnuDzT' // thank you NFT
    //let uriImage = 'https://ipfs.io/ipfs/bafybeihfgwla34hifpekxjpyga4bibjj3m37ul5j77br7q7vr4ajs4rgiq' // thank you NFT

    // Save metadata
    const metadata = {
      creditValue: offsetTxt,
      ...(extraMetadata?.output ?? {}),
      mintedBy: "CFCE via GiveCredit",
      created: created,
      donorAddress: donorWalletAddress,
      organization: organizationName,
      initiative: initiativeName,
      image: uriImage,
      network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "unknown",
      coinCode: token,
      coinIssuer: chain,
      coinValue: amountCUR,
      usdValue: amountUSD,
      // operation: opid,  <-- is this important?
    }

    console.log("META", metadata)
    const fileId = `meta-${txId}` // unique file id, used to be opid, is this OK?
    const bytes = Buffer.from(JSON.stringify(metadata, null, 2))
    const cidMeta = await uploadDataToIPFS(fileId, bytes, "text/plain")
    console.log("CID", cidMeta)
    if (!cidMeta || typeof cidMeta !== "string") {
      throw new Error("Error uploading metadata")
    }
    const uriMeta = `ipfs:${cidMeta}`
    //let uriMeta = process.env.IPFS_GATEWAY_URL + cidMeta
    console.log("META URI", uriMeta)

    // Mint NFT
    // Contracts we'll invoke to mint receipt NFTs
    const receiptConctractsByChain: Array<{
      chain: ChainSlugs
      contract: string
    }> = []
    // Find all receipt contracts in the app config, add to array
    for (const chainSlug in appConfig.chains) {
      const chain = appConfig.chains[chainSlug as ChainSlugs]
      if (chain?.contracts.receiptMintbotERC721) {
        receiptConctractsByChain.push({
          chain: chainSlug as ChainSlugs,
          contract: chain.contracts.receiptMintbotERC721,
        })
      }
    }
    if (receiptConctractsByChain.length === 0) {
      console.error("No receipt contracts found")
      return { success: false, error: "No receipt contracts found" }
    }

    let tokenId = ""
    for (const chainContract of receiptConctractsByChain) {
      const mintResponse = BlockchainManager.getInstance()[
        chainContract.chain
      ]?.server.mintNFT({
        contractId: chainContract.contract,
        address: donorWalletAddress,
        uri: uriMeta,
        walletSeed:
          process.env[`${chainContract.chain.toUpperCase()}_WALLET_SEED`] ?? "",
      })
      // .mintNFT({});
      console.log("RESMINT", mintResponse)
      if (!mintResponse) {
        throw new Error("Error minting NFT")
      }
      if ("error" in mintResponse && typeof mintResponse.error === "string") {
        throw new Error(mintResponse.error)
      }
      if (
        "tokenId" in mintResponse &&
        typeof mintResponse.tokenId === "string"
      ) {
        tokenId = mintResponse?.tokenId
      }
    }
    const offerId = "" // no need for offers in soroban

    // Save NFT data to Prisma
    const data = {
      created: new Date(),
      donorAddress: donorWalletAddress,
      user: { connect: { id: userId } },
      organization: { connect: { id: organizationId } },
      initiative: { connect: { id: initiativeId } },
      metadataUri: uriMeta,
      imageUri: uriImage,
      coinNetwork: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "",
      coinSymbol: token,
      coinLabel: chain,
      coinValue: amountCUR,
      usdValue: amountUSD,
      tokenId: tokenId, // TODO: how to handle multiple tokenIds?
      offerId: offerId,
      status: 1,
    }

    const saved = await newNftData(data)

    // Success
    console.log("Minting completed")
    const result = {
      success: true,
      image: uriImage,
      metadata: uriMeta,
      tokenId: tokenId,
      offerId: offerId,
    }
    console.log("RESULT", result)
    return result
  } catch (ex) {
    console.error(ex)
    if (ex instanceof Error) {
      throw new Error(`Error minting NFT receipt: ${ex.message}`)
    }
    throw new Error("Error minting NFT receipt: unknown error")
  }
}
