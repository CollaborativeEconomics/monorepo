function coinFromChain(chain:string){
  return {
    'Stellar': 'xlm'
  }[chain] || ''
}

function chainFromCoin(coin:string){
  return {
    'xlm': 'Stellar'
  }[coin] || ''
}

export {
  coinFromChain,
  chainFromCoin
}