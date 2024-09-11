import appConfig from "@cfce/app-config"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/types"
import { keys as _keys } from "lodash"
import type { Interface } from "../interfaces"
import FreighterWallet from "../interfaces/FreighterWallet"
import MetaMaskWallet from "../interfaces/MetamaskClient"
import StellarServer from "../interfaces/StellarServer"
import Web3Server from "../interfaces/Web3Server"
import XrplServer from "../interfaces/XrplServer"
import XummClient from "../interfaces/XummClient"
import _SacrificialInterface from "../interfaces/_SacrificialInterface"
import type ChainBaseClass from "./ChainBaseClass"

const x = new MetaMaskWallet("stellar", "testnet")
console.log("BlockchainManager", {
  _SacrificialInterface,
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
})

type ContractType = "receiptMintbotERC721"
interface ChainConfig {
  name: string
  slug: ChainSlugs
  network: string
  contracts: Partial<Record<ContractType, string>>
  wallets: ClientInterfaces[]
  tokens: TokenTickerSymbol[]
  destinationTag?: string
}

interface ManagerConfig {
  chains: ChainConfig[]
  defaults: {
    network: Network
    wallet: string
    chain: string
    coin: string
  }
}

type ChainClasses<ClientClass = Interface, ServerClass = Interface> = {
  client: ChainBaseClass
  server: ChainBaseClass
}

type ChainConstructor = new (slug: ChainSlugs, network: string) => Interface

const chainInterfaceMap: Record<
  ChainSlugs,
  { client: ChainConstructor; server: ChainConstructor }
> = {
  arbitrum: { client: MetaMaskWallet, server: Web3Server },
  avalanche: { client: MetaMaskWallet, server: Web3Server },
  base: { client: MetaMaskWallet, server: Web3Server },
  binance: { client: MetaMaskWallet, server: Web3Server },
  celo: { client: MetaMaskWallet, server: Web3Server },
  eos: { client: MetaMaskWallet, server: Web3Server },
  ethereum: { client: MetaMaskWallet, server: Web3Server },
  filecoin: { client: MetaMaskWallet, server: Web3Server },
  flare: { client: MetaMaskWallet, server: Web3Server },
  optimism: { client: MetaMaskWallet, server: Web3Server },
  polygon: { client: MetaMaskWallet, server: Web3Server },
  starknet: { client: MetaMaskWallet, server: Web3Server },
  stellar: { client: FreighterWallet, server: StellarServer },
  xinfin: { client: MetaMaskWallet, server: Web3Server },
  xrpl: { client: XummClient, server: XrplServer },
}

export const BlockchainManager: Partial<Record<ChainSlugs, ChainClasses>> = {}

console.log(appConfig.chains)

for (const chain of appConfig.chains) {
  const { client, server } = chainInterfaceMap[chain.slug]
  console.log(chain.slug, client, server, FreighterWallet, StellarServer)
  if (!client || !server) {
    throw new Error(`No interface found for chain ${chain.slug}`)
  }
  BlockchainManager[chain.slug] = {
    client: new client(chain.slug, chain.network),
    server: new server(chain.slug, chain.network),
  }
}

export default BlockchainManager
