import { apiFetch, apiPost } from '~/utils/api'

export async function getContract(chain, network, contract_type, entity){
  try {
    const contract = await apiFetch(`contracts?chain=${chain}&network=${network}&contract_type=${contract_type}&entity_id=${entity}`)
    console.log('CTR', contract)
    if(!contract || contract?.error){
      return null
    }
    const contractId = contract?.data[0].contract_address
    console.log('CTR ID', contractId)
    return contractId
  } catch(ex) {
    console.error(ex)
    return null
  }
}

