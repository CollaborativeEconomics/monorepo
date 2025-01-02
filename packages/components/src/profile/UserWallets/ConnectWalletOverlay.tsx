'use client';

import { getChainConfiguration } from '@cfce/blockchain-tools';
import type { ChainSlugs } from '@cfce/types';
import { Plus } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogTrigger } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { connectWallet } from './actions';

type ConnectWalletOverlayProps = {
  onSuccess?: () => void;
};

export function ConnectWalletOverlay({ onSuccess }: ConnectWalletOverlayProps) {
  const { toast } = useToast();
  const chainConfig = getChainConfiguration();

  const handleWalletConnect = async (chain: ChainSlugs) => {
    try {
      // This is a mock implementation - in reality you'd connect to the actual wallet
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

      await connectWallet(chain.toUpperCase(), mockAddress);

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
              {(Object.keys(chainConfig) as ChainSlugs[]).map(chain => (
                <Button
                  key={chain}
                  className="w-full flex items-center gap-2"
                  onClick={() => handleWalletConnect(chain)}
                >
                  <img
                    src={chainConfig[chain].icon}
                    alt={chain}
                    className="w-6 h-6"
                  />
                  <span>Connect {chainConfig[chain].name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
