import { LogoutButton } from '@cfce/auth';
import type { Wallet } from '@cfce/database';
import { Divider } from '../../ui';
import { ConnectWalletOverlay } from './ConnectWalletOverlay';
import { WalletRow } from './WalletRow';

type Props = {
  wallets: Wallet[];
};

export function UserWallets({ wallets }: Props) {
  return (
    <div className="w-full lg:w-1/3">
      <h2 className="font-semibold mb-2">Connected Wallets</h2>
      <div className="flex flex-col items-center border rounded-md mt-4 lg:mt-0 w-full bg-card">
        <div className="w-full space-y-3 p-8">
          {wallets.map(wallet => (
            <WalletRow key={wallet.id} wallet={wallet} />
          ))}
        </div>
        <Divider />
        <div className="w-full space-y-3 p-8">
          <ConnectWalletOverlay />
          <LogoutButton className="w-full" />
        </div>
      </div>
    </div>
  );
}
