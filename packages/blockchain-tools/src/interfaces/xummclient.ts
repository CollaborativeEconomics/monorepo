"use client"

import { Xumm } from "xumm"
import type { XummJsonTransaction } from "xumm-sdk/dist/src/types"
import type { ChainSlugs, Network } from "../chains/chainConfig"
import XrplCommon from "./XrplCommon"

export default class XummClient extends XrplCommon {
  wallet?: Xumm

  initialize(apiKey: string) {
    this.wallet = new Xumm(apiKey)
  }

  async connect() {
    console.log("XRP Connecting...")
    if (!this.wallet) {
      throw new Error("Missing Xumm API key")
    }
    try {
      const state = await this.wallet.authorize()
      console.log("Xumm Authorized", state)
      if (!state) {
        console.log("Error: no state")
        return
      }
      if ("me" in state) {
        const flow = state
        const user = state.me
        const address = user.account
        //const network = user.networkType.toLowerCase()
        const network = "testnet"
        const token = flow.jwt
        const data = {
          wallet: "xumm",
          address: address,
          chain: this.chain.chain,
          chaindid: "",
          currency: this.chain.symbol,
          network: network,
          token: token,
          topic: "",
        }
        return data
      }
      console.log("Error", state)
      return { error: "Could not connect" }
    } catch (ex) {
      console.log("Error", ex)
      if (ex instanceof Error) {
        return { error: ex.message }
      }
      return { error: "Error connecting" }
    }
  }

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo?: string }) {
    console.log("XRP Sending payment...", address, amount, memo)
    try {
      const request: XummJsonTransaction = {
        TransactionType: "Payment",
        Destination: address,
        Amount: String(this.toBaseUnit(amount)), // one million drops, 1 XRP
      }
      if (memo) {
        request.DestinationTag = memo
      }
      //this.sendPayload(request, callback)
      if (!this.wallet) {
        return { success: false, error: "No wallet" }
      }
      const payload = await this?.wallet?.payload?.createAndSubscribe(
        request,
        (event) => {
          if (Object.keys(event.data).indexOf("opened") > -1) {
            // Update the UI? The payload was opened.
            console.log("OPENED")
          }
          if (Object.keys(event.data).indexOf("signed") > -1) {
            // The `signed` property is present, true (signed) / false (rejected)
            console.log("SIGNED", event.data.signed)
            return event
          }
        },
      )
      console.log("CREATED", payload)
      // @ts-ignore: I hate types
      console.log("Payload URL:", payload?.created.next.always)
      // @ts-ignore: I hate types
      console.log("Payload QR:", payload?.created.refs.qr_png)
      // @ts-ignore: I hate types
      const resolved = await payload.resolved // Return payload promise for the next `then`
      if (!payload) {
        return { success: false, error: "No payload" }
      }
      const data = await this.wallet.payload?.get(payload.created)
      console.log("RESOLVED")
      console.log("Payload resolved", resolved)
      if (!data) {
        return { success: false, error: "No data" }
      }
      return { success: true, txid: data.response.txid }
      // TODO: re-implement below with new methods
      // data.signed doesn't exist anymore (https://docs.xumm.dev/js-ts-sdk/sdk-syntax/xumm.payload/get)
      // if (Object.keys(data).indexOf("signed") > -1) {
      // const approved = data.signed
      // console.log(approved ? "APPROVED" : "REJECTED")
      // if (approved) {
      //   return { success: true, txid: data.response.txid }
      // }
      // return { success: false, txid: "" }
      // }
    } catch (ex) {
      console.log("ERROR", ex)
      if (ex instanceof Error) {
        return { success: false, error: ex.message }
      }
      return {
        success: false,
        error: "Error sending payment",
      }
    }
  }

  // WARNING: below is untested
  // async sendToken({
  //   address,
  //   amount,
  //   token,
  //   issuer,
  //   memo,
  // }: {
  //   address: string
  //   amount: number
  //   token: string
  //   issuer: string
  //   memo?: string
  // }) {
  //   console.log("Sending token...", address, amount, token, issuer, memo)
  //   try {
  //     const request: XummJsonTransaction = {
  //       TransactionType: "Payment",
  //       Destination: address,
  //       Amount: {
  //         currency: token,
  //         issuer: issuer,
  //         value: amount.toString(),
  //       },
  //     }

  //     if (memo) {
  //       request.Memos = [
  //         {
  //           Memo: {
  //             MemoData: Buffer.from(memo, "utf8").toString("hex"),
  //           },
  //         },
  //       ]
  //     }

  //     return await this.sendPayload(request)
  //   } catch (ex) {
  //     console.log("ERROR", ex)
  //     if (ex instanceof Error) {
  //       return { success: false, error: ex.message }
  //     }
  //     return {
  //       success: false,
  //       error: "Error sending token",
  //     }
  //   }
  // }

  async acceptSellOffer(offerId: string, address: string) {
    console.log("XRP Accept sell offer...", offerId, address)
    const request: XummJsonTransaction = {
      TransactionType: "NFTokenAcceptOffer",
      NFTokenSellOffer: offerId,
      Account: address,
    }
    return await this.sendPayload(request)
  }

  async sendPayload(request: XummJsonTransaction) {
    console.log("REQUEST", request)
    if (!this.wallet) {
      return { success: false, error: "No wallet" }
    }
    try {
      const payload = await this?.wallet?.payload?.createAndSubscribe(
        request,
        (event) => {
          if (Object.keys(event.data).indexOf("opened") > -1) {
            // Update the UI? The payload was opened.
            console.log("OPENED")
          }
          if (Object.keys(event.data).indexOf("signed") > -1) {
            // The `signed` property is present, true (signed) / false (rejected)
            console.log("SIGNED", event.data.signed)
            return event
          }
        },
      )
      console.log("CREATED", payload)
      // @ts-ignore: I hate types
      console.log("Payload URL:", payload?.created.next.always)
      // @ts-ignore: I hate types
      console.log("Payload QR:", payload?.created.refs.qr.svg)
      // @ts-ignore: I hate types
      const resolved = await payload.resolved // Return payload promise for the next `then`
      console.log("RESOLVED")
      console.log("Payload resolved", payload)
      if (!payload) {
        return { success: false, error: "No payload" }
      }
      const data = await this.wallet.payload?.get(payload.created)
      console.log("RESOLVED")
      console.log("Payload resolved", resolved)
      if (!data) {
        return { success: false, error: "No data" }
      }
      return { success: true, txid: data.response.txid }
      // TODO: re-implement below with new methods
      // if (Object.keys(payload.data).indexOf("signed") > -1) {
      //   const approved = payload.data.signed
      //   console.log(approved ? "APPROVED" : "REJECTED")
      //   if (approved) {
      //     callback({ success: true, txid: payload.data.txid })
      //   } else {
      //     callback({ success: false, txid: "" })
      //   }
      // }
    } catch (ex) {
      console.log("ERROR", ex)
      if (ex instanceof Error) {
        return { success: false, error: ex.message }
      }
      return {
        success: false,
        error: "Error sending payment",
      }
    }
  }
}
