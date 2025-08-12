
'use client'

import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { base } from 'wagmi/chains'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
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
  )
}
