import { Address, nativeToScVal }  from '@stellar/stellar-sdk'
import { networks } from '@/contracts/networks'
import { checkContract } from '@/contracts/credits/server'

export default async function restoreContract(contractId) {
  try {
    console.log('Restore Credits Contract', contractId)
    if(!contractId){ return {success:false, error:'Contract id not provided'} }
    const network = networks[process.env.NEXT_PUBLIC_STELLAR_NETWORK]
  console.log('NET', network)
    const from    = new Address(process.env.CFCE_MINTER_WALLET_ADDRESS).toScVal()
    const secret  = process.env.CFCE_MINTER_WALLET_SECRET
    const method  = 'donate'
    const amount  = nativeToScVal('10000000', { type: 'i128' }) // 100 stroops to allow percent fees
    const args    = [from, amount]
    const result  = await checkContract(network, secret, contractId, method, args)
    console.log('Restore Result', result)
    return result
  } catch(ex:any) {
    console.error('Error restoring', ex)
    return {success:false, error:ex.message}
  }
}
