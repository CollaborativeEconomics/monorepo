import {
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
} from "../../interfaces"
import {
  BlockchainClientInterfaces,
  BlockchainServerInterfaces,
} from "../BlockchainManager"

jest.mock("../../interfaces", () => ({
  FreighterWallet: jest.fn(),
  MetaMaskWallet: jest.fn(),
  StellarServer: jest.fn(),
  Web3Server: jest.fn(),
  XrplServer: jest.fn(),
  XummClient: jest.fn(),
}))

describe("BlockchainManager", () => {
  // it("should initialize the BlockchainManager with the correct configuration", () => {
  //   const instance = BlockchainManager.instance

  //   expect(instance).toBeDefined()
  //   expect(instance.config).toBeDefined()
  // })
  it("Server interface correctly connects and stores the XDC chain", () => {
    const serverInterface = BlockchainServerInterfaces.evm
    serverInterface.setChain("xdc")
    expect(serverInterface).toBeDefined()
    expect(serverInterface.chain?.slug).toBe("xdc")
  })

  it("should correctly connect and store the Stellar chain", () => {
    const stellar = BlockchainServerInterfaces.stellar
    expect(stellar).toBeDefined()
    expect(stellar.chain?.slug).toBe("stellar")
  })

  // it("should return undefined for an uninitialized chain", () => {
  //   const starknet = BlockchainManager.starknet
  //   expect(starknet).toBeUndefined()
  // })
})
