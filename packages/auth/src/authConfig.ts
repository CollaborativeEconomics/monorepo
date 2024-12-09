import { walletConfig } from "@cfce/blockchain-tools"
import type { AuthConfig, AuthTypes } from "@cfce/types"
import type { Provider } from "next-auth/providers/index"
import authProviders from "./authProviders"

const authConfig: AuthConfig = {
  argent: {
    authProvider: authProviders.argent,
    icon: walletConfig.argent.icon,
    name: "Argent",
    slug: "argent",
  },
  crossmark: {
    authProvider: authProviders.crossmark,
    icon: walletConfig.crossmark.icon,
    name: "Crossmark",
    slug: "crossmark",
  },
  freighter: {
    authProvider: authProviders.freighter,
    icon: walletConfig.freighter.icon,
    name: "Freighter",
    slug: "freighter",
  },
  gemwallet: {
    authProvider: authProviders.gemwallet,
    icon: walletConfig.gemwallet.icon,
    name: "Gem Wallet",
    slug: "gemwallet",
  },
  metamask: {
    authProvider: authProviders.metamask,
    icon: walletConfig.metamask.icon,
    name: "Metamask",
    slug: "metamask",
  },
  // lobstr: {
  // authProvider: authProviders.lobstr,
  // icon: walletConfig.lobstr.icon,
  //   name: "Lobstr",
  //   slug: "lobstr",
  // },
  xaman: {
    authProvider: authProviders.xaman,
    icon: walletConfig.xaman.icon,
    name: "Xaman",
    slug: "xaman",
  },
  github: {
    authProvider: authProviders.github,
    icon: require("./assets/github.svg").default,
    name: "Github",
    slug: "github",
  },
  google: {
    authProvider: authProviders.google,
    icon: require("./assets/google.svg").default,
    name: "Google",
    slug: "google",
  },
}

export function getAuthProviders(methods: AuthTypes[]): Provider[] {
  return methods.map((method) => authConfig[method].authProvider)
}

export default authConfig
