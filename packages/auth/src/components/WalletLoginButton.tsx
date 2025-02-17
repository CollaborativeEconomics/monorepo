"use client"
import { chainConfig } from "@cfce/app-config"
import appConfig from "@cfce/app-config"
import {
  BlockchainClientInterfaces,
  walletConfig,
} from "@cfce/blockchain-tools"
import { chainAtom } from "@cfce/state"
import type { ClientInterfaces } from "@cfce/types"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import React from "react"
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
  const [chainState, setChainState] = useAtom(chainAtom)
  const { selectedChain } = chainState
  const chain = chainConfig[selectedChain]
  const chainNetwork = chain.networks[appConfig.chainDefaults.network]
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

    const connection = await walletInterface.connect(chainNetwork.id)

    if ("error" in connection) {
      throw new Error(`Failed to connect to wallet: ${connection.error}`)
    }

    const { walletAddress, network, chain } = connection

    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`)
    }
    //console.log('WALLET LOGIN', walletAddress, chainConfig, network)
    if (!network.slug) {
      throw new Error("Slug not found")
    }

    const redirectUrl = await walletLogin(method, {
      walletAddress,
      network: network.network,
      chain,
    })
    if (redirectUrl) {
      router.push(redirectUrl)
    }
  }, [method, walletInterface, router, chainNetwork])

  return (
    <BaseLoginButton
      onClick={handleLogin}
      icon={wallet.icon}
      name={`${wallet.name} Wallet`}
      className={className}
    />
  )
}
