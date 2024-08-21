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
  | "xumm"
  | "xrpl"
  | "web3"
  | "stellar"
  | "argent"

export type Interface =
  | FreighterWallet
  | MetaMaskWallet
  | XummClient
  | XrplServer
  | StellarServer
  | Web3Server

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
