import Arbitrum from './factories/arbitrum'
import Stellar  from './factories/stellar'
import Starknet from './factories/starknet'

const Chains:Dictionary = { 
  Arbitrum,
  Stellar,
  Starknet
}
export function ChainsList(){
  return Object.keys(Chains)
}

export default Chains