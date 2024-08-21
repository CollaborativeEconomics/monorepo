import type { Interfaces } from "./index"

interface WalletConfig {
  icon: JSX.Element
  slug: Interfaces
  name: string
}

export const walletConfig: Partial<Record<Interfaces, WalletConfig>> = {
  freighter: {
    icon: require("../assets/freighter.svg").default,
    slug: "freighter",
    name: "Freighter",
  },
  metamask: {
    icon: require("../assets/metamask.svg").default,
    slug: "metamask",
    name: "Metamask",
  },
  xumm: {
    icon: require("../assets/xaman.svg").default,
    slug: "xumm",
    name: "Xaman",
  },
  argent: {
    icon: require("../assets/argent.svg").default,
    slug: "argent",
    name: "Argent",
  },
}

export function getWalletConfiguration(slugs: Interfaces[]): WalletConfig[] {
  return slugs.map((slug) => {
    const config = walletConfig[slug]
    if (config) {
      return config
    }
    throw new Error(`Wallet configuration not found for ${slug}`)
  }, [] as WalletConfig[])
}
