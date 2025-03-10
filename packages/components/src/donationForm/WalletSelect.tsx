"use client"

import appConfig from "@cfce/app-config"
import { getWalletConfiguration } from "@cfce/blockchain-tools"
import { chainAtom } from "@cfce/state"
import type { ClientInterfaces } from "@cfce/types"
import { useAtom } from "jotai"
import React from "react"
import { DonationFormSelect } from "./DonationFormSelect"

interface WalletOption {
  value: string
  label: string
  icon: string
}

export function WalletSelect({ className }: { className?: string }) {
  const [chainState, setChainState] = useAtom(chainAtom)
  const { selectedChain, selectedWallet } = chainState

  const wallets: WalletOption[] = React.useMemo(
    () =>
      getWalletConfiguration(
        appConfig.chains[selectedChain]?.enabledWallets ?? [],
      ).map((walletConfig) => ({
        value: walletConfig.slug,
        label: walletConfig.name,
        icon: walletConfig.icon,
      })),
    [selectedChain],
  )

  return (
    <DonationFormSelect<ClientInterfaces, WalletOption>
      className={className}
      id="wallet-select"
      options={wallets}
      currentOption={selectedWallet}
      handleChange={(wallet) => {
        setChainState((draft) => {
          draft.selectedWallet = wallet
        })
      }}
      placeHolderText="...select a cryptowallet"
    />
  )
}
