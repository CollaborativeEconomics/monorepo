import { http, type Config, createConfig, useConnect, useReconnect } from "wagmi"
import { connect, reconnect } from "@wagmi/core"
import { arbitrumSepolia as defaultChain } from "wagmi/chains"
import { injected, metaMask } from "wagmi/connectors"

export const wagmiConfig: Config = createConfig({
  chains: [defaultChain],
  connectors: [metaMask()], 
  //ssr: true,
  transports: {
    [defaultChain.id]: http(),
  },
})

export async function wagmiConnect(){
  const result = await connect(wagmiConfig, { connector: metaMask() })
  console.log('CONNECT', result)
  return result
}

export async function wagmiReconnect(){
  const result = await reconnect(wagmiConfig, { connectors: [metaMask()] })
  console.log('RECONNECT', result)
  return result
}

