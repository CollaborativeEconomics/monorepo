import {
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
} from "../../interfaces"
import BlockchainManager from "../BlockchainManager"

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
  it("should correctly connect and store the XDC chain", () => {
    const xdc = BlockchainManager.xdc
    expect(xdc).toBeDefined()
    expect(MetaMaskWallet).toHaveBeenCalledWith("xdc", expect.anything())
    expect(Web3Server).toHaveBeenCalledWith("xdc", expect.anything())
  })

  it("should correctly connect and store the Stellar chain", () => {
    const stellar = BlockchainManager.stellar
    expect(stellar).toBeDefined()
    expect(FreighterWallet).toHaveBeenCalledWith("stellar", expect.anything())
    expect(StellarServer).toHaveBeenCalledWith("stellar", expect.anything())
  })

  it("should return undefined for an uninitialized chain", () => {
    const starknet = BlockchainManager.starknet
    expect(starknet).toBeUndefined()
  })

  it("should have chain properties accessible via static getters", () => {
    expect(BlockchainManager.xdc).toBeDefined()
    expect(BlockchainManager.stellar).toBeDefined()
  })
})
