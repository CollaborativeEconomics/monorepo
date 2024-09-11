import type { ClientInterfaces } from "./index"

interface WalletConfig {
  // icon: string
  slug: ClientInterfaces
  name: string
}

export const walletConfig: Record<ClientInterfaces, WalletConfig> = {
  freighter: {
    // icon: require("../assets/freighter.svg").default,
    slug: "freighter",
    name: "Freighter",
  },
  metamask: {
    // icon: require("../assets/metamask.svg").default,
    slug: "metamask",
    name: "Metamask",
  },
  xaman: {
    // icon: require("../assets/xaman.svg").default,
    slug: "xaman",
    name: "Xaman",
  },
  argent: {
    // icon: require("../assets/argent.svg").default,
    slug: "argent",
    name: "Argent",
  },
}

export function getWalletConfiguration(
  slugs: ClientInterfaces[],
): WalletConfig[] {
  return slugs.map((slug) => {
    const config = walletConfig[slug]
    if (config) {
      return config
    }
    throw new Error(`Wallet configuration not found for ${slug}`)
  }, [] as WalletConfig[])
}
