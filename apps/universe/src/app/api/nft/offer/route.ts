import { NextApiRequest, NextApiResponse } from 'next'
import Chains from '@/lib/chains/server/apis'

// POST /api/nft/offer {tokenid}
//   Create offer Id for NFT transfer
//   Send tokenId, offerId to client
export async function POST(request: Request) {
  console.log('API OFFER...')

  try {
    const body:any = await request.json()
    const {chain, tokenid, address}:{chain:string, tokenid:string, address:string} = body
    console.log('CHAIN', chain)
    console.log('TOKENID', tokenid)
    console.log('ADDRESS', address)
    if(!chain || !tokenid || !address){
      return Response.json({ error: 'Required chain, tokenid and address are missing' }, {status:500})
    }
    const result = await Chains[chain].createSellOffer(tokenid, address)
    console.log('Offer result', result)
    if (!result || result.error) {
      return Response.json({ error: 'Error creating sell offer' }, {status:500})
    }
    const offerId = result?.offerId
    return Response.json({ success: true, offerId })
  } catch (ex:any) {
    console.error(ex)
    return Response.json({ success: false, error: ex.message }, {status:500})
  }
}
