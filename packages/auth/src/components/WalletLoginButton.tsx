'use client';
import {
  BlockchainManager,
  chainConfig as chainConfigs,
} from '@cfce/blockchain-tools';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
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
  const walletInterface =
    BlockchainManager[chain as keyof typeof BlockchainManager]?.client;

  async function handleLogin() {
    if (!walletInterface) {
      throw new Error(`No wallet interface found for chain: ${chain}`);
    }

    const { network, walletAddress } = await walletInterface.connect();

    if (!walletAddress) {
      throw new Error(`No wallet address found: ${walletAddress}`);
    }

    await walletLogin(method, {
      walletAddress,
      chainConfig,
      network,
    });
  }

  return (
    <BaseLoginButton
      onClick={handleLogin}
      icon={`/images/${chain}-wallet.svg`}
      name={`${chainConfig.name} Wallet`}
      className={className}
    />
  );
}
