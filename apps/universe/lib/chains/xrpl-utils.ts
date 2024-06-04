import { NextResponse } from 'next/server'
import { AccountNFTsResponse, TxResponse } from 'xrpl'

interface PayloadType {
  method: string;
  params: any[];
}

// interface FetchResponse<T> {
//   result: NextResponse & T;
// }

// Fetch ripple rpc servers
// Returns payload result
// On error returns error:message
export async function fetchApi<ResponseType>(
  payload: PayloadType
): Promise<ResponseType | { error: string }> {
  try {
    let url = process.env.XRPL_RPC_URI || ''
    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    let result = await fetch(url, options);
    let data = await result.json();
    return data;
  } catch (ex:any) {
    console.error(ex);
    return { error: ex.message };
  }
}


// After creating a sell offer, parses the tx response to get the offer Id
// Loops all affected nodes looking for an offer
// If a NFTokenOffer is found, that's the offer Id
// Else returns null
export function findOffer(txInfo:any){
  for (var i = 0; i < txInfo.result.meta.AffectedNodes.length; i++) {
    let node = txInfo.result.meta.AffectedNodes[i]
    if(node.CreatedNode && node.CreatedNode.LedgerEntryType=='NFTokenOffer'){
      return node.CreatedNode.LedgerIndex
    }
  }
}


// After minting a token, parses the tx response to get the last token Id
// Loops all affected nodes looking for a token in final fields but not in previous
// If a node is found, that's the token Id freshly minted
// Else returns null
export function findToken(txInfo:any){
  let found = null
  for (var i=0; i<txInfo.result.meta.AffectedNodes.length; i++) {
    let node = txInfo.result.meta.AffectedNodes[i]
    if(node.ModifiedNode && node.ModifiedNode.LedgerEntryType=='NFTokenPage'){
      let m = node.ModifiedNode.FinalFields.NFTokens.length
      let n = node.ModifiedNode.PreviousFields.NFTokens.length
      for (var j=0; j<m; j++) {
        let tokenId = node.ModifiedNode.FinalFields.NFTokens[j].NFToken.NFTokenID
        found = tokenId
        for (var k=0; k<n; k++) {
          if(tokenId==node.ModifiedNode.PreviousFields.NFTokens[k].NFToken.NFTokenID){
            found = null
            break
          }
        }
        if(found){ break }
      }
    }
    if(found){ break }
  }
  return found
}


export async function getAccountNFTs(account: string) {
  console.log({ account });
  let txInfo = await fetchApi<AccountNFTsResponse>({
    method: 'account_nfts',
    params: [
      {
        account: account,
        ledger_index: 'validated'
      }
    ]
  });
  if (!txInfo || 'error' in txInfo) {
    console.log('ERROR', 'Account not found:', { account });
    return { error: 'Account not found' };
  }
  console.log('NFTs', txInfo);
  return txInfo?.result?.account_nfts;
}


