import { get } from "lodash";
import ChainInstance, { Chain, ChainSymbol } from "@/chains/ChainInstance";
import {
  NFTokenCreateOffer,
  NFTokenMint,
  Node,
  TxResponse,
  isCreatedNode,
  isModifiedNode,
} from "xrpl";
import { NFTokenPage } from "xrpl/dist/npm/models/ledger";

export const mainnetConfig = {
  id: 0,
  name: "Xrpl Mainnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://livenet.xrpl.org",
  rpcurl: "https://s1.ripple.com:51234",
  wssurl: "wss://s1.ripple.com",
};

export const testnetConfig = {
  id: 0,
  name: "Xrpl Testnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://testnet.xrpl.org",
  rpcurl: "https://s.altnet.rippletest.net:51234",
  wssurl: "wss://s.altnet.rippletest.net:51233",
};

type transactionMethods =
  | "tx"
  | "submit"
  | "submit_multisigned"
  | "transaction_entry"
  | "tx_history";

class Xrpl extends ChainInstance {
  chain: Chain = "XRPL";
  symbol: ChainSymbol = "XRP";
  logo = "xrp.svg";
  mainnet = mainnetConfig;
  testnet = testnetConfig;

  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
  }

  async getTransactionInfo(txid: string): Promise<unknown> {
    console.log("Get tx info by txid", txid);
    const txResponse = await this.fetchLedger("tx", {
      transaction: txid,
      binary: false,
    });
    if (!txResponse || "error" in txResponse) {
      console.log(
        "ERROR: Exception occured while retrieving transaction info",
        txid,
      );
      return { error: "Exception occured while retrieving transaction info" };
    }
    if (
      txResponse?.result?.validated === undefined &&
      txResponse?.result?.validated
    ) {
      console.log("ERROR", "Transaction is not validated on ledger");
      return { error: "Transaction is not validated on ledger" };
    }
    //console.log('TXINFO', txResponse)
    const result = {
      success: true,
      account: txResponse.result.Account,
      amount:
        txResponse.result.Amount > 0
          ? txResponse.result.Amount / 1000000
          : txResponse.result.Amount,
      destination: txResponse.result.Destination,
      destinationTag: txResponse.result.DestinationTag,
    };
    return result;
  }

  findOffer(txInfo: TxResponse<NFTokenCreateOffer>): unknown {
    const affectedNodes = get(txInfo, "result.meta.AffectedNodes") as
      | Node[]
      | undefined;
    if (typeof affectedNodes === "undefined") {
      return { error: "No affected nodes found" };
    }
    for (var i = 0; i < affectedNodes.length; i++) {
      let node = affectedNodes[i];
      if (
        isCreatedNode(node) &&
        node.CreatedNode.LedgerEntryType == "NFTokenOffer"
      ) {
        return node.CreatedNode.LedgerIndex;
      }
    }
  }

  async fetchLedger(
    method: transactionMethods,
    params: Record<string, unknown>,
  ) {
    try {
      let url = this.provider.rpcurl;
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          params: [params],
        }),
      };
      let result = await fetch(url, options);
      let data = await result.json();
      return data;
    } catch (ex: any) {
      console.error(ex);
      return { error: ex.message };
    }
  }

  findToken(txInfo: TxResponse<NFTokenMint>): unknown {
    let found: string | null = null;
    const affectedNodes = get(txInfo, "result.meta.AffectedNodes") as
      | Node[]
      | undefined;
    if (!Array.isArray(affectedNodes)) {
      return { error: "No affected nodes found" };
    }
    for (var i = 0; i < affectedNodes.length; i++) {
      let node = affectedNodes[i];
      if (isModifiedNode(node)) {
        let tokens = get(node, "ModifiedNode.FinalFields.NFTokens") as
          | NFTokenPage["NFTokens"]
          | undefined;

        let previousTokens = get(
          node,
          "ModifiedNode.PreviousFields.NFTokens",
        ) as NFTokenPage["NFTokens"] | undefined;

        if (
          typeof tokens === "undefined" ||
          typeof previousTokens === "undefined"
        ) {
          return { error: "No final or previous fields found" };
        }

        for (var j = 0; j < tokens.length; j++) {
          let tokenId = tokens[j].NFToken.NFTokenID;
          found = tokenId;
          for (var k = 0; k < previousTokens.length; k++) {
            if (tokenId == previousTokens[k].NFToken.NFTokenID) {
              found = null;

              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      if (found) {
        break;
      }
    }
    return found;
  }
}

export default Xrpl;
