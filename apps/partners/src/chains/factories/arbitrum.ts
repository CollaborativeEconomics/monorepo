import type { ContractFactoryDeployer } from ".."

const ArbitrumContractDeployer: ContractFactoryDeployer = {
  Credits: async (args: unknown) => {
    return {
      success: false,
      txid: null,
      contractId: null,
      block: null,
      error: "Not ready",
    }
  },
  NFTReceipt: async (args: unknown) => {
    return {
      success: false,
      txid: null,
      contractId: null,
      block: null,
      error: "Not ready",
    }
  },
}

export default ArbitrumContractDeployer
