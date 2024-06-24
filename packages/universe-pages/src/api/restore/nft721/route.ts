import { Address, Contract }  from '@stellar/stellar-sdk'
import { networks } from '@/contracts/networks'
import { submit }   from '@/contracts/nft721/server'
//import { Contract } from '@/contracts/nft721/client'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const requrl = new URL(request.url)
    const contract = (requrl.searchParams.get('contract') || '')
    if(!contract){ return Response.json({success:false, error:'Contract to restore not provided'}, {status:500}) }
    console.log('Contract', contract)
    const network = networks[process.env.NEXT_PUBLIC_STELLAR_NETWORK]
    const to      = new Address(process.env.CFCE_MINTER_WALLET_ADDRESS).toScVal()
    const secret  = process.env.CFCE_MINTER_WALLET_SECRET
    const method  = 'mint'
    const args    = [to]
    const res     = await submit(network, secret, contract, method, args)
    console.log('RESTORED', res)
    return Response.json(res)
  } catch(ex:any) {
    console.error(ex)
    return Response.json({success:false, error:ex.message}, {status:500})
  }
}
