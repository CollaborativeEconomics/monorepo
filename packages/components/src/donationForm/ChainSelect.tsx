"use client"

import appConfig from "@cfce/app-config"
import { getChainConfiguration } from "@cfce/blockchain-tools"
import { chainAtom } from "@cfce/state"
import type { AppChainConfig, ChainSlugs } from "@cfce/types"
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
  const { selectedChain } = chainState
  console.log({ selectedChain })

  const chains: ChainOption[] = React.useMemo(
    () =>
      Object.entries(getChainConfiguration()).map(([_, chain]) => ({
        value: chain.slug,
        label: chain.name,
        icon: chain.icon,
      })),
    [],
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
          const defaultToken = chainConfig.tokens[0]
          draft.selectedToken = defaultToken
        })
      }}
      placeHolderText="...select a cryptocurrency"
    />
  )
}
