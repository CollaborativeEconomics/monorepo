import appConfig from "./appConfig"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Credit (Development)",
  description: "Make tax-deductible donations of carbon credits (Development)",
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains = {
  ...appConfig.chains,
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet",
}

const auth = appConfig.auth

const appConfigStaging: typeof appConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigStaging