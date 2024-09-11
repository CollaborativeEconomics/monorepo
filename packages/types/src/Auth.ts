import type { Provider } from "next-auth/providers/index"
import type { ClientInterfaces } from "./BlockchainTools"

export type AuthTypes = ClientInterfaces | "github" | "google"

export type AuthConfig = Record<
  AuthTypes,
  {
    authProvider: Provider
    // icon: string
    name: string
    slug: AuthTypes
  }
>
