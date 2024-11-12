import { Xumm } from "xumm"
import type { XummJsonTransaction } from "xumm-sdk/dist/src/types"
import XrplCommon from "./XrplCommon"

export default class XummClient extends XrplCommon {
  wallet?: Xumm

  getWallet() {
    if (!this.wallet) {
      try {
        this.wallet = new Xumm(process.env.NEXT_PUBLIC_XUMM_API_KEY as string)
      } catch (error) {
        throw new Error(
          `Error initializing Xumm client: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        )
      }
    }
    return this.wallet
  }

  async connect() {
    console.log("XRP Connecting...")
    const wallet = this.getWallet()
    try {
      const state = await wallet.authorize()
      console.log("Xumm Authorized", state)
      if (!state) {
        console.log("Error: no state")
        return { success: false, error: "Error: no state" }
      }
      if ("me" in state) {
        const flow = state
        const user = state.me
        const address = user.account
        const network = ((await wallet.user.networkType) ?? "").toLowerCase()
        const token = flow.jwt
        // const data = {
        //   wallet: "xumm",
        //   address: address,
        //   chain: this.chain.name,
        //   chaindid: "",
        //   currency: this.chain.symbol,
        //   network: network,
        //   token: token,
        //   topic: "",
        // }
        return { success: true, walletAddress: address, network: network }
      }
      console.log("Error", state)
      return { success: false, error: "Could not connect" }
    } catch (ex) {
      console.log("Error", ex)
      return {
        success: false,
        error: ex instanceof Error ? ex.message : "Error connecting",
      }
    }
  }

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: bigint; memo?: string }): Promise<{
    success: boolean
    error?: string
    txid?: string
    walletAddress?: string
  }> {
    console.log("XRP Sending payment...", address, amount, memo)
    const wallet = this.getWallet()
    try {
      const request: XummJsonTransaction = {
        TransactionType: "Payment",
        Destination: address,
        Amount: String(amount), // one million drops, 1 XRP
      }
      if (memo) {
        request.DestinationTag = memo
      }
      //this.sendPayload(request, callback)
      const payload = await wallet.payload?.createAndSubscribe(
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
      const data = await wallet.payload?.get(payload.created)
      console.log("RESOLVED")
      console.log("Payload resolved", resolved)
      if (!data) {
        return { success: false, error: "No data" }
      }
      return {
        success: true,
        ...(data.response.txid ? { txid: data.response.txid } : {}),
        ...(data.response.account
          ? { walletAddress: data.response.account }
          : {}),
      }
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
    const wallet = this.getWallet()
    try {
      const payload = await wallet?.payload?.createAndSubscribe(
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
      const data = await wallet.payload?.get(payload.created)
      console.log("RESOLVED")
      console.log("Payload resolved", resolved)
      if (!data) {
        return { success: false, error: "No data" }
      }
      return {
        success: true,
        ...(data.response.txid ? { txid: data.response.txid } : {}),
      }
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
