import type { ContractFactoryDeployer } from ".."

const ArbitrumContractDeployer: ContractFactoryDeployer = {
  Credits: {
    deploy: async (args: unknown) => {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Not ready",
      }
    },
  },
  NFTReceipt: {
    deploy: async (args: unknown) => {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Not ready",
      }
    },
  },
}

export default ArbitrumContractDeployer
