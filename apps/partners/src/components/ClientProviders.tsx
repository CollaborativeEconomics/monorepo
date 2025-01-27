'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { http, createConfig, WagmiProvider, type WagmiConfig } from 'wagmi';
import { metaMask } from '@wagmi/connectors';
import { arbitrumSepolia } from 'wagmi/chains';

const wagmiConfig = createConfig({
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
      <SessionProvider>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
