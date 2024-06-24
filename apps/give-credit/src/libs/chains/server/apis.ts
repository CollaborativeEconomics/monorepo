// SERVER LIBS
import Stellar from './stellar'

type Dictionary = { [key:string]:any }

const Chains:Dictionary = {
  'Stellar': Stellar
}

export default Chains