import { http, type Config, createConfig } from "wagmi"
import { arbitrumSepolia } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

export const config: Config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [metaMask()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})
