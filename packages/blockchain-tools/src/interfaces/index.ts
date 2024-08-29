import FreighterWallet from "./FreighterClient"
import MetaMaskWallet from "./MetamaskClient"
import StellarServer from "./StellarServer"
import Web3Server from "./Web3Server"
import XrplServer from "./XrplServer"
import XummClient from "./XummClient"
import { getWalletConfiguration, walletConfig } from "./walletConfig"

export type Interfaces =
  | "freighter"
  | "metamask"
  | "xaman"
  | "xrpl"
  | "web3"
  | "stellar"
  | "argent"

export type ClientInterfaces = Exclude<Interfaces, "web3" | "xrpl" | "stellar">

export type Constructable<T> = new (...args: unknown[]) => T

export type Interface =
  | Constructable<FreighterWallet>
  | Constructable<MetaMaskWallet>
  | Constructable<XummClient>
  | Constructable<XrplServer>
  | Constructable<StellarServer>
  | Constructable<Web3Server>

export {
  FreighterWallet,
  MetaMaskWallet,
  XummClient,
  XrplServer,
  StellarServer,
  Web3Server,
  getWalletConfiguration,
  walletConfig,
}
