import FreighterWallet from "./FreighterWallet"
import MetaMaskWallet from "./MetamaskClient"
import StellarServer from "./StellarServer"
import Web3Server from "./Web3Server"
import XrplServer from "./XrplServer"
import CrossmarkWallet from "./CrossmarkWallet"
import GemWallet from "./GemWallet"
import XummClient from "./XummClient"
import _SacrificialInterface from "./_SacrificialInterface"
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
  _SacrificialInterface,
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
