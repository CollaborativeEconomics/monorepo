"use client"
import type { AuthTypes, ChainSlugs, ClientInterfaces } from "@cfce/types"
import { GithubLoginButton } from "./GithubLoginButton"
import { GoogleLoginButton } from "./GoogleLoginButton"
import { WalletLoginButton } from "./WalletLoginButton"

interface AuthButtonProps {
  method: AuthTypes
  className?: string
}

export function AuthButton({ method, className }: AuthButtonProps) {
  switch (method) {
    case "github":
      return <GithubLoginButton className={className} />
    case "google":
      return <GoogleLoginButton className={className} />
    default: {
      if (typeof method === "undefined") {
        throw new Error("Wallet is required for wallet login")
      }
      return <WalletLoginButton method={method} className={className} />
    }
  }
}
