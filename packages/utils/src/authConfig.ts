import { walletConfig } from "@cfce/blockchain-tools"
import type { AuthConfig, AuthTypes } from "@cfce/types"
import type { Provider } from "next-auth/providers/index"
import authProviders from "./auth/authProviders"

const authConfig: AuthConfig = {
  freighter: {
    authProvider: authProviders.freighter,
    icon: walletConfig.freighter.icon,
    name: "Freighter",
    slug: "freighter",
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
  argent: {
    authProvider: authProviders.argent,
    icon: walletConfig.argent.icon,
    name: "Argent",
    slug: "argent",
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
  //console.log("Getting auth providers", methods)
  const providers = methods.map((method) => authConfig[method].authProvider)
  //console.log('PROVIDERS', providers)
  return providers
}

export default authConfig
