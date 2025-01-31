import type {
  ClientInterfaces,
  ServerInterfaces,
} from "@cfce/types"
import { keys as _keys } from "lodash"
import { get as _get } from "lodash"
import type { Interface } from "../interfaces"
import CrossmarkWallet from "../interfaces/CrossmarkWallet"
import FreighterWallet from "../interfaces/FreighterWallet"
import GemWallet from "../interfaces/GemWallet"
import MetaMaskWallet from "../interfaces/MetamaskClient"
import StarknetWallet from "../interfaces/StarknetWallet"
import StellarServer from "../interfaces/StellarServer"
import Web3Server from "../interfaces/Web3Server"
import XrplServer from "../interfaces/XrplServer"
import XummClient from "../interfaces/XummClient"
import type InterfaceBaseClass from "./InterfaceBaseClass"

type ChainClasses<ClientClass = Interface, ServerClass = Interface> = {
  client: Partial<Record<ClientInterfaces, InterfaceBaseClass>>
  server: InterfaceBaseClass
}

const BlockchainClientInterfaces: Record<ClientInterfaces, InterfaceBaseClass> =
  {
    xaman: new XummClient(),
    crossmark: new CrossmarkWallet(),
    gemwallet: new GemWallet(),
    freighter: new FreighterWallet(),
    argent: new StarknetWallet(),
    metamask: new MetaMaskWallet(),
  }

const BlockchainServerInterfaces = {
  evm: new Web3Server(),
  starknet: new StarknetWallet(),
  stellar: new StellarServer(),
  xrpl: new XrplServer(),
} satisfies Record<ServerInterfaces, InterfaceBaseClass>

export {
  BlockchainClientInterfaces,
  BlockchainServerInterfaces,
}
