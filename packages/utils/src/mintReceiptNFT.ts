"use server"
import "server-only"
import { posthogNodeClient } from "@cfce/analytics/server"
import appConfig from "@cfce/app-config"
import { BlockchainManager } from "@cfce/blockchain-tools"
import { getWalletSecret } from "@cfce/blockchain-tools"
import { getCoinRate } from "@cfce/blockchain-tools/server"
import {
  type Chain,
  getInitiativeById,
  getNFTbyTokenId,
  getOrganizationById,
  getUserByWallet,
  newNftData,
  newUser,
} from "@cfce/database"
import { uploadDataToIPFS } from "@cfce/ipfs"
import { Triggers, runHook } from "@cfce/registry-hooks"
import { ChainSlugs, DonationStatus, TokenTickerSymbol } from "@cfce/types"
import { DateTime } from "luxon"
import { sendEmailReceipt } from "./mailgun"
import { registryApi } from "./registryApi"

interface MintAndSaveReceiptNFTParams {
  transaction: {
    txId: string
    chain: ChainSlugs
    token: TokenTickerSymbol
    donorWalletAddress: string
    destinationWalletAddress: string
    amount: number
    date: string
  }
  initiativeId: string
  organizationId: string
  donorName?: string
  email?: string
}

export async function mintAndSaveReceiptNFT({
  transaction,
  organizationId,
  initiativeId,
  donorName = "Anonymous",
  email,
}: MintAndSaveReceiptNFTParams) {
  //console.log('MINT', transaction, organizationId, initiativeId, donorName, email)
  try {
    const {
      txId,
      chain,
      token,
      donorWalletAddress,
      destinationWalletAddress,
      amount,
      date,
    } = transaction
    console.log("MINT", chain, txId)
    console.log("Chain", chain)
    console.log("Token", token)
    const rate = await getCoinRate({ chain, symbol: token })

    // #region: Input validation
    if (!txId || typeof txId !== "string") {
      return { success: false, error: "Invalid transaction ID" }
    }
    if (!chain || !Object.values(ChainSlugs).includes(chain)) {
      return { success: false, error: "Invalid chain" }
    }

    if (!token || !Object.values(TokenTickerSymbol).includes(token)) {
      return { success: false, error: "Invalid token" }
    }

    if (!donorWalletAddress || typeof donorWalletAddress !== "string") {
      return { success: false, error: "Invalid donor wallet address" }
    }

    if (
      !destinationWalletAddress ||
      typeof destinationWalletAddress !== "string"
    ) {
      return { success: false, error: "Invalid destination wallet address" }
    }

    if (typeof amount !== "number" || amount <= 0) {
      return { success: false, error: "Invalid amount" }
    }

    if (!date || Number.isNaN(Date.parse(date))) {
      return { success: false, error: "Invalid date" }
    }

    if (!organizationId || typeof organizationId !== "string") {
      return { success: false, error: "Invalid organization ID" }
    }

    if (!initiativeId || typeof initiativeId !== "string") {
      return { success: false, error: "Invalid initiative ID" }
    }

    if (typeof donorName !== "string") {
      return { success: false, error: "Invalid donor name" }
    }

    if (email && (typeof email !== "string" || !email.includes("@"))) {
      return { success: false, error: "Invalid email address" }
    }

    if (typeof rate !== "number" || rate <= 0) {
      return { success: false, error: "Invalid rate" }
    }
    // #endregion

    // #region: Check for existing receipt
    const existingReceipt = await getNFTbyTokenId(txId, chain)
    if (existingReceipt) {
      return { success: false, error: "Receipt already exists" }
    }
    // #endregion

    // #region: Initialize blockchain tools and verify transaction
    const chainTool = BlockchainManager[chain]?.server
    if (!chainTool) {
      console.error("No chain tool found for chain", chain)
      return { success: false, error: "No chain tool found for chain" }
    }

    const txInfo = await chainTool.getTransactionInfo(txId, true) // wait for receipt
    if ("error" in txInfo) {
      console.log("ERROR", "Transaction not found")
      throw new Error(`Transaction not found: ${txInfo.error}`)
    }
    // #endregion

    // #region: Fetch related data (user, initiative, organization)
    const created = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss")

    console.log("Donor", donorWalletAddress)
    const user = await getUserByWallet(donorWalletAddress)
    let userId = user?.id || ""
    
    if (!userId) {
      console.log("ERROR", "User not found")
      console.log("Creating new user for wallet", donorWalletAddress)
      const newUserData = {
        name: donorName,
        email: email || undefined,
        wallets: {
          create: [{
            address: donorWalletAddress,
            chain: chain.charAt(0).toUpperCase() + chain.slice(1) as Chain
          }]
        }
      }
      const createdUser = await newUser(newUserData)
      if (!createdUser?.id) {
        throw new Error("Failed to create user")
      }
      userId = createdUser.id
    }

    const initiative = await getInitiativeById(initiativeId)
    if (!initiative) {
      console.log("ERROR", "Initiative not found")
      throw new Error("Initiative info not found")
    }
    const initiativeName = initiative.title || "Direct Donation"

    const organization = await getOrganizationById(organizationId)
    if (!organization) {
      console.log("ERROR", "Organization not found")
      throw new Error("Organization not found")
    }
    const organizationName = organization?.name
    // #endregion

    // #region: Calculate amounts and prepare metadata
    const amountCUR = (+amount).toFixed(4)
    const amountUSD = (+amount * rate).toFixed(4)
    console.log("Image URI", initiative?.imageUri)

    const uriImage = initiative?.imageUri 
      ? initiative.imageUri
      : "ipfs:QmZWgvsGUGykGyDqjL6zjbKjtqNntYZqNzQrFa6UnyZF1n"

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

    const creditMeta: { creditValue?: string } = {}
    const credit = initiative?.credits?.[0]
    console.log("CREDIT", initiative?.credits)
    if (credit) {
      const creditTon = Number(credit.value) / (rate || 1)
      let offsetVal = creditTon > 0 ? Number(amountUSD) / creditTon : 0
      if (offsetVal < 0.00005) {
        offsetVal = 0.0001
      } // Round up
      const offsetTxt = `${offsetVal.toFixed(4)} Tons`
      creditMeta.creditValue = offsetTxt
    }
    // #endregion

    const currentChain = appConfig.chains[chain]
    if (!currentChain) throw new Error("Chain not found")
    const network = currentChain.network

    // #region: Prepare and upload metadata
    const metadata = {
      ...creditMeta,
      ...(extraMetadata?.output ? JSON.parse(JSON.stringify(extraMetadata.output)) : {}),
      mintedBy: "CFCE via GiveCredit",
      created: created,
      donorAddress: donorWalletAddress,
      organization: organizationName,
      initiative: initiativeName,
      image: uriImage,  // Already sanitized above
      coinCode: token,
      coinIssuer: chain,
      coinValue: amountCUR,
      usdValue: amountUSD,
      network,
    }

    console.log("META", metadata)
    const fileId = `meta-${txId}`
    // More thorough sanitization of the entire metadata object
    const metadataString = JSON.stringify(metadata, (key, value) => {
      if (typeof value === 'string') {
        return value // Remove any HTML tags and trim
      }
      return value;
    }, 2)
    console.log("META STRING", metadataString)
    const bytes = Buffer.from(metadataString)
    console.log("BYTES", bytes)
    const cidMeta = await uploadDataToIPFS(fileId, bytes, "application/json")
    console.log("CID", cidMeta)
    if (!cidMeta || typeof cidMeta !== "string") {
      throw new Error("Error uploading metadata")
    }
    const uriMeta = `ipfs:${cidMeta}`
    console.log("META URI", uriMeta)
    // #endregion

    /*
    // #region: Mint NFT on chains
    const receiptContractsByChain: Array<{
      chain: ChainSlugs
      contract: string
    }> = []
    for (const chainSlug of Object.keys(appConfig.chains) as ChainSlugs[]) {
      const chain = appConfig.chains[chainSlug]
      if (chain?.contracts.receiptMintbotERC721) {
        receiptContractsByChain.push({
          chain: chainSlug as ChainSlugs,
          contract: chain.contracts.receiptMintbotERC721,
        })
      }
    }
    if (receiptContractsByChain.length === 0) {
      console.error("No receipt contracts found")
      return { success: false, error: "No receipt contracts found" }
    }

    let tokenId = ""
    const walletSecret = getWalletSecret(chain)
    for (const chainContract of receiptConctractsByChain) {
      const args = {
        contractId: chainContract.contract,
        address: donorWalletAddress,
        uri: uriMeta,
        walletSeed: walletSecret,
      })
      console.log("RESMINT", mintResponse)
      if (!mintResponse) {
        throw new Error('Failed to mint NFT');
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
    // #endregion
*/

    // #region: Mint NFT on current chain only
    const receiptContract = currentChain.contracts.receiptMintbotERC721
    console.log("CTR", receiptContract)

    // WARN: XRPL doesn't use contracts
    if (!receiptContract) {
      console.error("No receipt contracts found")
      return { success: false, error: "No receipt contract found" }
    }

    let tokenId = ""
    const walletSecret = getWalletSecret(chain)
    const args = {
      contractId: receiptContract,
      address: donorWalletAddress,
      uri: uriMeta,
      walletSeed: walletSecret,
    }
    const mintResponse = await BlockchainManager[chain]?.server.mintNFT(args)
    console.log("RESMINT", mintResponse)
    if (!mintResponse) {
      throw new Error("Error minting NFT")
    }
    if ("error" in mintResponse && typeof mintResponse.error === "string") {
      throw new Error(mintResponse.error)
    }
    if ("tokenId" in mintResponse && typeof mintResponse.tokenId === "string") {
      tokenId = mintResponse?.tokenId
    }
    // #endregion

    // #region: Save data to DB
    const data = {
      created: new Date(),
      donorAddress: donorWalletAddress,
      user: { connect: { id: userId } },
      organization: { connect: { id: organizationId } },
      initiative: { connect: { id: initiativeId } },
      metadataUri: uriMeta,
      imageUri: uriImage,
      coinNetwork: network,
      coinSymbol: token,
      coinLabel: chain,
      coinValue: amountCUR,
      usdValue: amountUSD,
      tokenId: tokenId,
      status: DonationStatus.claimed,
    }
    console.log("NFT", data)
    const saved = await newNftData(data)

    if (!saved) {
      throw new Error("Problem saving NFT data to db")
    }
    // #endregion

    // #region: Mint NFTCC and attach to TBA for donor
    // TODO: <<<
    // #endregion

    // #region: Send email receipt
    if (email) {
      const emailResponse = await sendEmailReceipt(email, {
        date,
        donorName,
        organizationName: organization.name,
        address: organization.mailingAddress ?? "",
        ein: organization.EIN ?? "",
        coinSymbol: token,
        coinValue: amountCUR,
        usdValue: amountUSD,
      })
      if (!emailResponse.success) {
        console.warn(
          `Minted NFT, but failed to send email receipt: ${emailResponse.error}`,
        )
      }
    }
    // #endregion

    // #region: Return result
    posthogNodeClient.capture({
      distinctId: userId,
      event: "receipt_minted",
      properties: {
        coinSymbol: token,
        coinValue: amountCUR,
        usdValue: amountUSD,
        organization: organization.slug,
        initiative: initiative.slug,
      },
    })
    posthogNodeClient.shutdown()
    const result = {
      success: true,
      image: uriImage,
      metadata: uriMeta,
      tokenId: tokenId,
    }
    console.log("RESULT", result)
    return result
    // #endregion
  } catch (ex) {
    console.error(ex)
    if (ex instanceof Error) {
      return {
        success: false,
        error: `Error minting NFT receipt: ${ex.message}`,
      }
    }
    return { success: false, error: "Error minting NFT receipt: unknown error" }
  }
}
