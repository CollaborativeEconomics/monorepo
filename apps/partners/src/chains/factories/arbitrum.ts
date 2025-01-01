interface CreditsData {
  provider: string
  vendor: string
  bucket: string
}

interface ReceiptData {
  name: string
  symbol: string
}

class ArbitrumContracts {
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

const Arbitrum = new ArbitrumContracts()

export default Arbitrum