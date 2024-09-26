import type { ClientInterfaces } from "@cfce/types"

interface WalletConfig {
  icon: string
  slug: ClientInterfaces
  name: string
}

export const walletConfig: Record<ClientInterfaces, WalletConfig> = {
  freighter: {
    icon: "/icons/freighter.webp",
    slug: "freighter",
    name: "Freighter",
  },
  metamask: {
    icon: "/icons/metamask.webp",
    slug: "metamask",
    name: "Metamask",
  },
  xaman: {
    icon: "/icons/xaman.webp",
    slug: "xaman",
    name: "Xaman",
  },
  argent: {
    icon: "/icons/argent.webp",
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
