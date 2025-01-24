import type { AuthTypes, ClientInterfaces } from "@cfce/types"

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
  crossmark: {
    icon: "/icons/crossmark.webp",
    slug: "crossmark",
    name: "Crossmark",
  },
  freighter: {
    icon: "/icons/freighter.webp",
    slug: "freighter",
    name: "Freighter",
  },
  gemwallet: {
    icon: "/icons/gem.webp",
    slug: "gemwallet",
    name: "Gem Wallet",
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
