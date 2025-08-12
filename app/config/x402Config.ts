import { base } from 'wagmi/chains'

export const X402_CONFIG = {
  // Base network configuration
  chain: base,
  
  // USDC token address on Base
  usdcTokenAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  
  // Default payment amounts (in USDC)
  defaultTipAmounts: {
    like: '0.01',
    recast: '0.02', 
    comment: '0.05'
  },
  
  // Payment timeout in milliseconds
  paymentTimeout: 30000,
  
  // Maximum payment amount (in USDC) - safety limit
  maxPaymentAmount: '1.00',
  
  // Base block explorer URL
  blockExplorerUrl: 'https://basescan.org',
  
  // x402 facilitator endpoint (if needed)
  facilitatorUrl: process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || 'https://facilitator.x402.org'
} as const

export type X402Config = typeof X402_CONFIG

