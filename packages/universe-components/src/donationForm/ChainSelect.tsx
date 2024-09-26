'use client';

import appConfig from '@cfce/app-config';
import { getChainConfiguration } from '@cfce/blockchain-tools';
import type { AppChainConfig, ChainSlugs } from '@cfce/types';
import { chainAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import React from 'react';
import { DonationFormSelect } from './DonationFormSelect';

interface ChainOption {
  value: ChainSlugs;
  label: string;
  icon: string;
}

export function ChainSelect() {
  const [chainState, setChainState] = useAtom(chainAtom);
  const { selectedChain } = chainState;

  const chains: ChainOption[] = React.useMemo(
    () =>
      getChainConfiguration(appConfig.chains.map(chain => chain.slug)).map(
        chain => ({
          value: chain.slug,
          label: chain.name,
          icon: chain.icon,
        }),
      ),
    [],
  );

  return (
    <DonationFormSelect<ChainSlugs, ChainOption>
      id="currency-select"
      className="mb-6"
      options={chains}
      currentOption={selectedChain}
      handleChange={chain => {
        setChainState(draft => {
          draft.selectedChain = chain;
        });
      }}
      placeHolderText="...select a cryptocurrency"
    />
  );
}
