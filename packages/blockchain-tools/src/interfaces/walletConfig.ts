import type { ClientInterfaces } from "@cfce/types"

interface WalletConfig {
  icon: string
  slug: ClientInterfaces
  name: string
}

export const walletConfig: Record<ClientInterfaces, WalletConfig> = {
  argent: {
    icon: "/icons/argent.webp",
    slug: "argent",
    name: "Argent",
  },
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
  tronlink: {
    icon: "/icons/tronlink.webp",
    slug: "tronlink",
    name: "TronLink",
  },
  xaman: {
    icon: "/icons/xaman.webp",
    slug: "xaman",
    name: "Xaman",
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
