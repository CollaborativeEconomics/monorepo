import { init } from "@cfce/registry-hooks"

if (!process.env.CFCE_REGISTRY_API_KEY) {
  throw new Error("CFCE_REGISTRY_API_KEY is not set")
}
if (!process.env.CFCE_REGISTRY_API_URL) {
  throw new Error("CFCE_REGISTRY_API_URL is not set")
}

// Init hooks library
init({
  registryApiKey: process.env.CFCE_REGISTRY_API_KEY,
  registryBaseUrl: process.env.CFCE_REGISTRY_API_URL,
})
