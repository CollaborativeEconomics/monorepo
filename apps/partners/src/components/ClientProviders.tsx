"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { metaMask } from "@wagmi/connectors"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { http, type WagmiConfig, WagmiProvider, createConfig } from "wagmi"
import { arbitrumSepolia } from "wagmi/chains"

const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  connectors: [metaMask()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
