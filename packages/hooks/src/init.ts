let registryApiKey = "";
let registryBaseUrl = "https://registry.cfce.io/api";

export function getRegistryApiKey() {
  return registryApiKey;
}
export function getRegistryBaseUrl() {
  return registryBaseUrl;
}
export default function init(config: { registryApiKey: string, registryBaseUrl?: string}) {
  registryApiKey = config.registryApiKey;
  if (config.registryBaseUrl) {
    registryBaseUrl = config.registryBaseUrl;
  }
}