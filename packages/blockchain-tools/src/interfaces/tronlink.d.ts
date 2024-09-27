import type { TronLinkInpageProvider } from "@tronlink/providers"

declare global {
  interface Window {
    tronWeb?: TronLinkInpageProvider
  }
}
