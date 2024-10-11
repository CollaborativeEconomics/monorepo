import appConfig from "@cfce/app-config"
import { init } from "@cfce/registry-hooks"

const {
  apis: {
    registry: { apiUrl },
  },
} = appConfig

if (!process.env.CFCE_REGISTRY_API_KEY) {
  throw new Error("CFCE_REGISTRY_API_KEY is not set")
}
if (!apiUrl) {
  throw new Error("appconfig.apis.registry.apiUrl is not set")
}

// Init hooks library
init({
  registryApiKey: process.env.CFCE_REGISTRY_API_KEY,
  registryBaseUrl: apiUrl,
})
