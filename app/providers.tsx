'use client'

import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

// Create wagmi config for wallet client functionality
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'default-key'}
          chain={base}
          config={{
            appearance: {
              mode: 'dark',
              theme: 'default',
              name: 'AutoTip On Farcaster',
              logo: '/logo.png',
            },
          }}
        >
          {children}
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
