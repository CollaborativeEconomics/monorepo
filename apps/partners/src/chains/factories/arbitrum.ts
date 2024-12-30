class ArbitrumContracts {
  contracts = {
    Credits: {
      deploy: async (args)=>{
        return {error:'Not ready'}
      }
    }
  }
}

const Arbitrum = new ArbitrumContracts()

export default Arbitrum