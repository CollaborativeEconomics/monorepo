"use client";

import Xrpl from "./common";
import { Xumm } from "xumm";
import { XummJsonTransaction } from "xumm-sdk/dist/src/types";

type Dictionary = { [key: string]: any };

interface XrplOptions {
  network?: "mainnet" | "testnet";
  apiKey?: string;
  apiSecret?: string;
}

class XrplClient extends Xrpl {
  wallet: Xumm;
  constructor({ network = "mainnet", apiKey, apiSecret } = {} as XrplOptions) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    if (!apiKey || !apiSecret)
      throw new Error("Missing Xumm API key and secret");
    this.wallet = new Xumm(apiKey, apiSecret);
  }

  async connect(callback: (options: Record<string, any>) => void) {
    console.log("XRP Connecting...");
    this.wallet
      .authorize()
      .then((state) => {
        console.log("Xumm Authorized", state);
        if (!state) {
          console.log("Error: no state");
          return;
        }
        if ("me" in state) {
          const flow = state;
          const user = state.me;
          const address = user.account;
          //const network = user.networkType.toLowerCase()
          const network = "testnet";
          const token = flow.jwt;
          const data = {
            wallet: "xumm",
            address: address,
            chain: this.chain,
            chaindid: "",
            currency: this.symbol,
            network: network,
            token: token,
            topic: "",
          };
          callback(data);
        } else {
          console.log("Error", state);
          callback({ error: 'Could not connect' })
          return;
        }
      })
      .catch((ex) => {
        console.log("Error", ex);
        if (ex instanceof Error) {
          callback({ error: ex.message });
        }
      });
  }

  async sendPayment(
    address: string,
    amount: number,
    destinTag: string,
    callback: (data: Dictionary) => void,
  ) {
    console.log("XRP Sending payment...", address, amount, destinTag);
    try {
      const request: XummJsonTransaction = {
        TransactionType: 'Payment',
        Destination: address,
        Amount: String(this.toBaseUnit(amount)) // one million drops, 1 XRP
      }
      if (destinTag) { request.DestinationTag = destinTag }
      //this.sendPayload(request, callback)
      if (!this.wallet) { callback({ success: false, txid: '' }); return }
      this?.wallet?.payload?.createAndSubscribe(request, (event) => {
        if (Object.keys(event.data).indexOf('opened') > -1) {
          // Update the UI? The payload was opened.
          console.log('OPENED')
        }
        if (Object.keys(event.data).indexOf('signed') > -1) {
          // The `signed` property is present, true (signed) / false (rejected)
          console.log('SIGNED', event.data.signed)
          return event
        }
      }).then((payload: any) => {
        console.log('CREATED', payload)
        // @ts-ignore: I hate types
        console.log('Payload URL:', payload?.created.next.always)
        // @ts-ignore: I hate types
        console.log('Payload QR:', payload?.created.refs.qr_png)
        // @ts-ignore: I hate types
        return payload.resolved // Return payload promise for the next `then`
      }).then((payload: any) => {
        console.log('RESOLVED')
        console.log('Payload resolved', payload)
        if (Object.keys(payload.data).indexOf('signed') > -1) {
          const approved = payload.data.signed
          console.log(approved ? 'APPROVED' : 'REJECTED')
          if (approved) {
            callback({ success: true, txid: payload.data.txid })
          } else {
            callback({ success: false, txid: '' })
          }
        }
      }).catch((ex: any) => {
        console.log('ERROR', ex)
        callback({ success: false, txid: '', error: 'Error sending payment: ' + ex })
      })
      // This is where you can do `xumm.payload.get(...)` to fetch details
      console.log('----DONE')
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        callback({ error: ex.message })
      }
    }
  }

  async acceptSellOffer(offerId: string, address: string, callback: any) {
    console.log("XRP Accept sell offer...", offerId, address);
    const request: XummJsonTransaction = {
      TransactionType: "NFTokenAcceptOffer",
      NFTokenSellOffer: offerId,
      Account: address,
    };
    this.sendPayload(request, callback);
  }

  async sendPayload(request: XummJsonTransaction, callback: any) {
    console.log("REQUEST", request);
    if (!this.wallet) {
      callback({ success: false, txid: "" });
      return;
    }
    this?.wallet?.payload
      ?.createAndSubscribe(request, (event) => {
        if (Object.keys(event.data).indexOf("opened") > -1) {
          // Update the UI? The payload was opened.
          console.log("OPENED");
        }
        if (Object.keys(event.data).indexOf("signed") > -1) {
          // The `signed` property is present, true (signed) / false (rejected)
          console.log("SIGNED", event.data.signed);
          return event;
        }
      })
      .then((payload) => {
        console.log("CREATED", payload);
        // @ts-ignore: I hate types
        console.log("Payload URL:", payload?.created.next.always);
        // @ts-ignore: I hate types
        console.log("Payload QR:", payload?.created.refs.qr.svg);
        // @ts-ignore: I hate types
        return payload.resolved; // Return payload promise for the next `then`
      })
      .then((payload) => {
        console.log("RESOLVED");
        console.log("Payload resolved", payload);
        if (Object.keys(payload.data).indexOf("signed") > -1) {
          const approved = payload.data.signed;
          console.log(approved ? "APPROVED" : "REJECTED");
          if (approved) {
            callback({ success: true, txid: payload.data.txid });
          } else {
            callback({ success: false, txid: "" });
          }
        }
      })
      .catch((ex: any) => {
        console.log("ERROR", ex);
        callback({
          success: false,
          txid: "",
          error: "Error sending payment: " + ex,
        });
      });
    // This is where you can do `xumm.payload.get(...)` to fetch details
    console.log("----DONE");
  }
}

export default XrplClient;
