'use client';

import { chainConfig } from '@cfce/blockchain-tools';
import type { Prisma } from '@cfce/database';
import type { ChainSlugs } from '@cfce/types';
import copy from 'clipboard-copy';
import { Clipboard, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { removeWallet } from './actions';

type WalletRowProps = {
  wallet: Prisma.UserGetPayload<{
    include: { wallets: true };
  }>['wallets'][number];
};

export function WalletRow({ wallet }: WalletRowProps) {
  const handleCopyAddress = async (address: string) => {
    await copy(address);
  };

  // @deprecated, many edge cases
  // const handleRemoveWallet = async () => {
  //   try {
  //     await removeWallet(wallet.id);
  //   } catch (error) {
  //     console.error('Failed to remove wallet:', error);
  //   }
  // };

  return (
    <div className="flex items-center space-x-2 w-full border rounded-lg p-2">
      <Image
        src={chainConfig[wallet.chain.toLowerCase() as ChainSlugs]?.icon}
        width={24}
        height={24}
        alt="Chain"
        className="flex-shrink-0"
      />
      <div className="flex-1 px-3 py-1.5 text-sm font-mono truncate">
        {wallet.address}
      </div>
      <button
        type="button"
        className="p-1.5 hover:bg-muted rounded-md transition-colors"
        title="Copy address"
        onClick={() => handleCopyAddress(wallet.address)}
      >
        <Clipboard size={18} />
      </button>
      {/* <button
        type="button"
        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        title="Remove wallet"
        onClick={handleRemoveWallet}
      >
        <Trash2 size={18} />
      </button> */}
    </div>
  );
}
