'use client';
import {
  BlockchainManager,
  chainConfig as chainConfigs,
} from '@cfce/blockchain-tools';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { useCallback } from 'react';
import { walletLogin } from '../actions';
import { BaseLoginButton } from './BaseLoginButton';

interface WalletLoginButtonProps {
  method: AuthTypes;
  chain: ChainSlugs;
  className?: string;
}

export function WalletLoginButton({
  method,
  chain,
  className,
}: WalletLoginButtonProps) {
  const chainConfig = chainConfigs[chain];
  console.log('WalletLoginButton', { method, chain, className, chainConfig });
  const walletInterface =
    BlockchainManager[chain as keyof typeof BlockchainManager]?.client;

  if (!walletInterface) {
    throw new Error(`No wallet interface found for chain: ${chain}`);
  }

  const handleLogin = useCallback(async () => {
    const { network, walletAddress } = await walletInterface.connect();

    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`);
    }

    await walletLogin(method, {
      walletAddress,
      chainConfig,
      network,
    });
  }, [method, walletInterface, chainConfig]);

  return (
    <BaseLoginButton
      onClick={handleLogin}
      icon={chainConfig.icon}
      name={`${chainConfig.name} Wallet`}
      className={className}
    />
  );
}
