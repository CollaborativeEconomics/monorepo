'use client';

import appConfig from '@cfce/app-config';
import { getWalletConfiguration } from '@cfce/blockchain-tools';
import type { Interfaces } from '@cfce/types';
import { chainAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import React from 'react';
import { DonationFormSelect } from './DonationFormSelect';

export function WalletSelect() {
  const [chainState, setChainState] = useAtom(chainAtom);
  const { selectedChain, selectedWallet } = chainState;

  const wallets = React.useMemo(
    () =>
      getWalletConfiguration(
        appConfig.chains.find(c => c.slug === selectedChain)?.wallets ?? [],
      ).map(walletConfig => ({
        value: walletConfig.slug,
        label: walletConfig.name,
        image: '', // walletConfig.icon,
      })),
    [selectedChain],
  );

  return (
    <DonationFormSelect
      id="wallet-select"
      className="mb-6"
      options={wallets}
      currentOption={selectedWallet}
      handleChange={wallet => {
        setChainState(draft => {
          draft.selectedWallet = wallet as Interfaces;
        });
      }}
      placeHolderText="...select a cryptowallet"
    />
  );
}
