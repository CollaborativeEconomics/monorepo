'use client';

import appConfig from '@cfce/app-config';
import { getWalletConfiguration } from '@cfce/blockchain-tools';
import type { Interfaces } from '@cfce/types';
import { chainAtom } from '@cfce/utils';
import { useAtom } from 'jotai';
import React from 'react';
import { DonationFormSelect } from './DonationFormSelect';

interface WalletOption {
  value: string;
  label: string;
  icon: string;
}

export function WalletSelect() {
  const [chainState, setChainState] = useAtom(chainAtom);
  const { selectedChain, selectedWallet } = chainState;

  const wallets: WalletOption[] = React.useMemo(
    () =>
      getWalletConfiguration(
        appConfig.chains[selectedChain]?.enabledWallets ?? [],
      ).map(walletConfig => ({
        value: walletConfig.slug,
        label: walletConfig.name,
        icon: walletConfig.icon,
      })),
    [selectedChain],
  );

  return (
    <DonationFormSelect<Interfaces, WalletOption>
      id="wallet-select"
      className="mb-6"
      options={wallets}
      currentOption={selectedWallet}
      handleChange={wallet => {
        setChainState(draft => {
          draft.selectedWallet = wallet;
        });
      }}
      placeHolderText="...select a cryptowallet"
    />
  );
}
