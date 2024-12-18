'use client';
import {
  BlockchainClientInterfaces,
  chainConfig as chainConfigs,
} from '@cfce/blockchain-tools';
import { chainAtom } from '@cfce/state';
import type { ClientInterfaces } from '@cfce/types';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { walletLogin } from '../actions';
import { BaseLoginButton } from './BaseLoginButton';

interface WalletLoginButtonProps {
  method: ClientInterfaces;
  className?: string;
}

export function WalletLoginButton({
  method,
  className,
}: WalletLoginButtonProps) {
  const { selectedChain: chain } = useAtomValue(chainAtom);
  const walletInterface = BlockchainClientInterfaces[method];
  const chainConfig = chainConfigs[chain];

  if (!walletInterface) {
    throw new Error(`No wallet interface found for wallet: ${method}`);
  }

  const router = useRouter();

  const handleLogin = useCallback(async () => {
    if (!walletInterface.connect) {
      throw new Error(`No connect method found for wallet: ${method}`);
    }

    const connection = await walletInterface.connect();

    if ('error' in connection) {
      throw new Error(`Failed to connect to wallet: ${connection.error}`);
    }

    const { walletAddress, network } = connection;

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
