import { init } from '@cfce/registry-hooks'

// Init hooks library
init({
  registryApiKey: process.env.CFCE_REGISTRY_API_KEY,
  registryBaseUrl: process.env.CFCE_REGISTRY_API_URL
})
