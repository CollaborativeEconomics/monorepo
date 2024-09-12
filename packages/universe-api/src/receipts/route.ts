import { BlockchainManager } from "@cfce/blockchain-tools"
import { getNFTbyTokenId, getOrganizationById } from "@cfce/database"
import type { ChainSlugs, TokenTickerSymbol } from "@cfce/types"
import {
  type ReceiptEmailBody,
  mintAndSaveReceiptNFT,
  sendEmailReceipt,
} from "@cfce/utils"
import type { NextRequest } from "next/server"

interface ReceiptData extends ReceiptEmailBody {
  email: string
}

interface Context {
  params: {
    id: string
  }
}

export interface ReceiptNFTParams {
  date: string
  donorName: string
  organizationId: string
  initiativeId: string
  email?: string
  transaction: {
    donorWalletAddress: string
    destinationWalletAddress: string
    txId: string
    chain: ChainSlugs
    token: TokenTickerSymbol
    coinValue: number
    usdValue: number
    rate: number
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    const receiptData: ReceiptNFTParams = await request.json()
    const {
      email,
      transaction: {
        txId,
        chain,
        token,
        donorWalletAddress,
        destinationWalletAddress,
        coinValue,
        usdValue,
        rate,
      },
    } = receiptData
    const existingReceipt = await getNFTbyTokenId(txId)
    if (existingReceipt) {
      return Response.json({ success: false, error: "Receipt already exists" })
    }

    // #region Mint NFT
    // Create and save NFT
    const receiptId = await mintAndSaveReceiptNFT({
      transaction: {
        txId,
        chain,
        token,
      },
      initiativeId: receiptData.initiativeId,
      donorWalletAddress,
      amount: coinValue,
      rate,
    })

    // #region validate transaction
    // Validate blockchain transaction, so they can't fake receipts
    // TODO: make trustless via e.g. oracle
    const transaction =
      await BlockchainManager[chain].server.getTransactionInfo(txId)
    if (transaction.error) {
      return Response.json({ success: false, error: transaction.error })
    }
    const { from, to, value } = transaction
    if (from !== donorWalletAddress) {
      return Response.json({
        success: false,
        error: "Donor wallet address does not match transaction",
      })
    }
    if (to !== destinationWalletAddress) {
      return Response.json({
        success: false,
        error: "Donor wallet address does not match transaction",
      })
    }
    if (value !== coinValue) {
      return Response.json({
        success: false,
        error: "Amount does not match transaction",
      })
    }

    // #region email receipt
    // send email receipt if provided
    if (email) {
      const organization = await getOrganizationById(receiptData.organizationId)
      if (!organization) {
        return Response.json({
          success: false,
          error: "Organization not found",
        })
      }
      const emailResponse = await sendEmailReceipt(email, {
        date: receiptData.date,
        donorName: receiptData.donorName,
        organizationName: organization.name,
        address: organization.mailingAddress ?? "",
        ein: organization.EIN ?? "",
        coinSymbol: receiptData.transaction.token,
        coinValue: coinValue.toFixed(2),
        usdValue: usdValue.toFixed(2),
      })
      console.log({ emailResponse })
      if (!emailResponse.success) {
        return Response.json({
          success: false,
          error: `Minted NFT, but failed to send email receipt: ${emailResponse.error}`,
        })
      }
    }
    const res = { success: true, receiptId }
    console.log("UPDATED", res)
    return Response.json(res)
  } catch (ex) {
    console.error(ex)
    return Response.json(
      {
        success: false,
        error:
          ex instanceof Error
            ? ex.message
            : "Unknown errror sending email receipt",
      },
      { status: 500 },
    )
  }
}
