class StarknetContracts {
  contracts = {
    Credits: {
      deploy: async (args)=>{
        return {error:'Not ready'}
      }
    }
  }
}

const Starknet = new StarknetContracts()

export default Starknet