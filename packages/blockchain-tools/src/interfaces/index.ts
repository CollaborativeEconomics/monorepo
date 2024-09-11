import FreighterWallet from "./FreighterWallet"
import MetaMaskWallet from "./MetamaskClient"
import StellarServer from "./StellarServer"
import Web3Server from "./Web3Server"
import XrplServer from "./XrplServer"
import XummClient from "./XummClient"
import _SacrificialInterface from "./_SacrificialInterface"
import { getWalletConfiguration, walletConfig } from "./walletConfig"

export type Interface =
  | FreighterWallet
  | MetaMaskWallet
  | XummClient
  | XrplServer
  | StellarServer
  | Web3Server

export {
  _SacrificialInterface,
  FreighterWallet,
  MetaMaskWallet,
  XummClient,
  XrplServer,
  StellarServer,
  Web3Server,
  getWalletConfiguration,
  walletConfig,
}
