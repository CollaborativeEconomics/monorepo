import CrossmarkWallet from "./CrossmarkWallet"
import FreighterWallet from "./FreighterWallet"
import GemWallet from "./GemWallet"
import MetaMaskWallet from "./MetamaskClient"
import StellarServer from "./StellarServer"
import Web3Server from "./Web3Server"
import XrplServer from "./XrplServer"
import XummClient from "./XummClient"
import { getWalletConfiguration, walletConfig } from "./walletConfig"

export type Interface =
  | CrossmarkWallet
  | FreighterWallet
  | GemWallet
  | MetaMaskWallet
  | XummClient
  | XrplServer
  | StellarServer
  | Web3Server

export {
  CrossmarkWallet,
  FreighterWallet,
  GemWallet,
  MetaMaskWallet,
  XummClient,
  XrplServer,
  StellarServer,
  Web3Server,
  getWalletConfiguration,
  walletConfig,
}
