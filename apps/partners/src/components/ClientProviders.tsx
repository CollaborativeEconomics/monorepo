'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { metaMask } from '@wagmi/connectors';
import { http, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  connectors: [metaMask()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
