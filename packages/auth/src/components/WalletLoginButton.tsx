"use client"
import {
  BlockchainClientInterfaces,
  walletConfig,
} from "@cfce/blockchain-tools"
import type { ClientInterfaces } from "@cfce/types"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { walletLogin } from "../actions"
import { BaseLoginButton } from "./BaseLoginButton"

interface WalletLoginButtonProps {
  method: ClientInterfaces
  className?: string
}

export function WalletLoginButton({
  method,
  className,
}: WalletLoginButtonProps) {
  const walletInterface = BlockchainClientInterfaces[method]
  const wallet = walletConfig[method]

  if (!walletInterface) {
    throw new Error(`No wallet interface found for wallet: ${method}`)
  }

  const router = useRouter()

  const handleLogin = useCallback(async () => {
    if (!walletInterface.connect) {
      throw new Error(`No connect method found for wallet: ${method}`)
    }

    const connection = await walletInterface.connect()

    if ("error" in connection) {
      throw new Error(`Failed to connect to wallet: ${connection.error}`)
    }

    const { walletAddress, network, chain } = connection

    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`)
    }
    //console.log('WALLET LOGIN', walletAddress, chainConfig, network)
    const redirectUrl = await walletLogin(method, {
      walletAddress,
      network: network.slug,
      chain,
    })
    if (redirectUrl) {
      router.push(redirectUrl)
    }
  }, [method, walletInterface, router])

  return (
    <BaseLoginButton
      onClick={handleLogin}
      icon={wallet.icon}
      name={`${wallet.name} Wallet`}
      className={className}
    />
  )
}
