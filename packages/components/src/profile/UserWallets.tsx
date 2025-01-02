import { LogoutButton } from '@cfce/auth';
import { chainConfig } from '@cfce/blockchain-tools';
import { getUserWallets } from '@cfce/database';
import type { ChainSlugs } from '@cfce/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { use } from 'react';

type Props = {
  userId: string;
};

export async function UserWallets({ userId }: Props) {
  const wallets = await getUserWallets({ userId });

  return (
    <div className="flex flex-col items-center border rounded-md mt-4 lg:mt-0 p-4 w-full lg:w-1/3 bg-card">
      {wallets?.length > 0 ? (
        <>
          <h1>Active Chains</h1>
          <div className="mt-4 pb-4 w-full border-b">
            {wallets.map(item => (
              <span
                key={item.id}
                className="inline-block border rounded-full p-1 mx-1"
              >
                <Image
                  src={
                    chainConfig[item.chain.toLowerCase() as ChainSlugs]?.icon
                  }
                  width={48}
                  height={48}
                  alt="Chain"
                />
              </span>
            ))}
            <span key={0} className="inline-block border rounded-full p-1">
              <Plus size={48} className="text-gray-400" />
            </span>
          </div>
          <LogoutButton />
        </>
      ) : (
        <>
          <p>No wallets</p>
          <button type="button">Connect Wallet</button>
          <LogoutButton />
        </>
      )}
    </div>
  );
}
