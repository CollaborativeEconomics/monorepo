import FreighterWallet from "./FreighterClient"
import MetaMaskWallet from "./MetamaskClient"
import XummClient from "./XummClient"
import XrplServer from "./XrplServer"
import StellarServer from "./StellarServer"
import Web3Server from "./Web3Server"

export type Interfaces =
  | "freighter"
  | "metamask"
  | "xumm"
  | "xrpl"
  | "web3"
  | "stellar"

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
}
