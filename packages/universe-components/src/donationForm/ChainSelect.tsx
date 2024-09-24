'use client';

import appConfig from '@cfce/app-config';
import { getChainConfiguration } from '@cfce/blockchain-tools';
import type { ChainSlugs } from '@cfce/types';
import { chainAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import React from 'react';
import { DonationFormSelect } from './DonationFormSelect';

export function ChainSelect() {
  const [chainState, setChainState] = useAtom(chainAtom);
  const { selectedChain } = chainState;

  const chains = React.useMemo(
    () =>
      getChainConfiguration(appConfig.chains.map(chain => chain.slug)).map(
        chain => ({
          value: chain.slug,
          label: chain.name,
          image: '', // chain.icon,
        }),
      ),
    [],
  );

  return (
    <DonationFormSelect<ChainSlugs>
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
