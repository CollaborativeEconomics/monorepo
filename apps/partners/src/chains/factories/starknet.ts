interface CreditsData {
  provider: string
  vendor: string
  bucket: string
}

interface ReceiptData {
  name: string
  symbol: string
}

class StarknetContracts {
  contracts = {
    Credits: {
      deploy: async (data:CreditsData)=>{
        return {error:'Not ready'}
      }
    },
    NFTReceipt: {
      deploy: async (data:ReceiptData)=>{
        return {error:'Not ready'}
      }
    }
  }
}

const Starknet = new StarknetContracts()

export default Starknet