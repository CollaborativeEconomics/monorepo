'use client';
import {
  BlockchainManager,
  chainConfig as chainConfigs,
} from '@cfce/blockchain-tools';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { useCallback } from 'react';
import { walletLogin } from '../actions';
import { BaseLoginButton } from './BaseLoginButton';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

  const handleLogin = useCallback(async () => {
    const { network, walletAddress } = await walletInterface.connect();

    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`);
    }
    //console.log('WALLET LOGIN', walletAddress, chainConfig, network)
  const redirectUrl = await walletLogin(method, {
      walletAddress,
      chainConfig,
      network,
    });
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [method, walletInterface, chainConfig, router]);


  return (
    <BaseLoginButton
      onClick={handleLogin}
      icon={chainConfig.icon}
      name={`${chainConfig.name} Wallet`}
      className={className}
    />
  );
}
