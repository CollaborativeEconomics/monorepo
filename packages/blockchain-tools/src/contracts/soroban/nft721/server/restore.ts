import { Address }  from '@stellar/stellar-sdk'
import { networks } from '@/contracts/networks'
import { checkContract } from '@/contracts/nft721/server'

export default async function restoreContract(contractId) {
  try {
    console.log('Restore NFT721 Contract', contractId)
    if(!contractId){ return {success:false, error:'Contract id not provided'} }
    const network = networks[process.env.NEXT_PUBLIC_STELLAR_NETWORK]
    const to      = new Address(process.env.CFCE_MINTER_WALLET_ADDRESS).toScVal()
    const secret  = process.env.CFCE_MINTER_WALLET_SECRET
    const method  = 'mint'
    const args    = [to]
    const result  = await checkContract(network, secret, contractId, method, args)
    return result
  } catch(ex:any) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
