'use client';

import appConfig from '@cfce/app-config';
import {
  BlockchainClientInterfaces,
  getChainConfiguration,
  getWalletConfiguration,
  walletConfig,
} from '@cfce/blockchain-tools';
import type { AuthTypes, ChainSlugs, ClientInterfaces } from '@cfce/types';
import { Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogTrigger } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { connectWallet } from './actions';

type ConnectWalletOverlayProps = {
  userId: string;
  onSuccess?: () => void;
};

export function ConnectWalletOverlay({
  userId,
  onSuccess,
}: ConnectWalletOverlayProps) {
  const { toast } = useToast();
  // const chainConfig = getChainConfiguration();
  const enabledWallets = appConfig.auth.filter(
    w => !['github', 'google'].includes(w),
  ) as ClientInterfaces[];
  // ClientInterfaces is a subset of AuthTypes

  const handleWalletConnect = async (wallet: ClientInterfaces) => {
    try {
      const walletInterface = BlockchainClientInterfaces[wallet];
      if (!walletInterface?.connect) {
        throw new Error('Wallet interface not found');
      }

      const walletResponse = await walletInterface.connect();
      if ('error' in walletResponse) {
        throw new Error(walletResponse.error);
      }

      const { walletAddress, chain } = walletResponse;

      await connectWallet(walletAddress, chain);

      toast({
        title: 'Wallet connected',
        description: 'Your wallet has been successfully connected.',
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus size={20} />
          <span>Add Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Connect Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80vh overflow-y-scroll">
            <div className="w-full flex flex-col gap-4">
              <Separator className="my-4" />
              {enabledWallets.map(wallet => {
                const walletConfig = getWalletConfiguration([wallet])[0];
                return (
                  <Button
                    key={wallet}
                    className="w-full flex items-between gap-2"
                    onClick={() => handleWalletConnect(wallet)}
                  >
                    <img
                      src={walletConfig.icon}
                      alt={wallet}
                      className="w-6 h-6"
                    />
                    <span>Connect {walletConfig.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
