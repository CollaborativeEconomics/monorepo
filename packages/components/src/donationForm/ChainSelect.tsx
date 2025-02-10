"use client"

import appConfig from "@cfce/app-config"
import { chainAtom } from "@cfce/state"
import type { ChainSlugs } from "@cfce/types"
import { useAtom } from "jotai"
import React from "react"
import { DonationFormSelect } from "./DonationFormSelect"

interface ChainOption {
  value: ChainSlugs
  label: string
  icon: string
}

export function ChainSelect() {
  const [chainState, setChainState] = useAtom(chainAtom)
  const { selectedChain, enabledChains } = chainState

  const chains: ChainOption[] = React.useMemo(
    () =>
      Object.entries(appConfig.chains).map(([_, chain]) => ({
        value: chain.slug,
        label: chain.name,
        icon: chain.icon,
        disabled: !enabledChains.includes(chain.slug),
      })),
    [enabledChains],
  )

  return (
    <DonationFormSelect<ChainSlugs, ChainOption>
      id="currency-select"
      className="mb-6"
      options={chains}
      currentOption={selectedChain}
      handleChange={(chain) => {
        setChainState((draft) => {
          draft.selectedChain = chain
          const chainConfig = appConfig.chains[chain]
          if (!chainConfig) {
            throw new Error(
              `Chain ${chain} not found in appConfig. Check ${process.env.NEXT_PUBLIC_APP_ID}/appConfig.${process.env.NEXT_PUBLIC_ENV}.ts`,
            )
          }
          const defaultToken = chainConfig.tokens.find(
            (token) => token.isNative,
          )
          if (!defaultToken) {
            throw new Error(
              `No native token found for chain ${chain} in appConfig. Check ${process.env.NEXT_PUBLIC_APP_ID}/appConfig.${process.env.NEXT_PUBLIC_ENV}.ts`,
            )
          }
          draft.selectedToken = defaultToken.symbol
        })
      }}
      placeHolderText="...select a cryptocurrency"
    />
  )
}
