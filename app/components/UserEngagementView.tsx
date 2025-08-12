'use client'

import { useState, useEffect } from 'react'
import { Alert } from './Alert'
import { Button } from './Button'
import { TransactionLog } from '../types'
import { useX402Payment } from '../hooks/useX402Payment'
import { X402_CONFIG } from '../config/x402Config'
import { parsePaymentError } from '../utils/errorHandling'
import { Heart, Repeat, MessageCircle, Coins, Loader2 } from 'lucide-react'

interface UserEngagementViewProps {
  postId: string
  onEngagement: (type: 'like' | 'recast' | 'comment') => void
}

export function UserEngagementView({ postId, onEngagement }: UserEngagementViewProps) {
  const [recentTip, setRecentTip] = useState<TransactionLog | null>(null)
  const [interactions, setInteractions] = useState({
    likes: 42,
    recasts: 18,
    comments: 7
  })
  const [processingInteraction, setProcessingInteraction] = useState<string | null>(null)
  
  // x402 payment integration
  const { isInitialized, isProcessing, processTipPayment, lastTransaction, error, clearError } = useX402Payment()

  // Handle real tip payment using x402
  const handleRealTipPayment = async (interactionType: 'like' | 'recast' | 'comment') => {
    if (!isInitialized) {
      console.warn('Payment service not initialized')
      return
    }

    setProcessingInteraction(interactionType)
    clearError()

    try {
      const tipAmount = X402_CONFIG.defaultTipAmounts[interactionType]
      
      const paymentRequest = {
        amount: tipAmount,
        tokenAddress: X402_CONFIG.usdcTokenAddress,
        recipient: '0x742d35Cc6634C0532925a3b8D0C9e3e0C0c0c0c0', // Example recipient address
        interactionType,
        postId
      }

      const result = await processTipPayment(paymentRequest)
      
      if (result.success && result.transactionLog) {
        setRecentTip(result.transactionLog)
        setTimeout(() => setRecentTip(null), 8000)
      }
    } catch (err) {
      console.error('Payment failed:', err)
    } finally {
      setProcessingInteraction(null)
    }
  }

  // Fallback to simulation if payment service not available
  const simulateTip = (interactionType: 'like' | 'recast' | 'comment') => {
    const mockTransaction: TransactionLog = {
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      senderFid: 12345,
      receiverFid: 67890,
      amount: X402_CONFIG.defaultTipAmounts[interactionType],
      tokenAddress: X402_CONFIG.usdcTokenAddress,
      interactionType,
      timestamp: new Date(),
      status: 'success'
    }

    setRecentTip(mockTransaction)
    setTimeout(() => setRecentTip(null), 5000)
  }

  const handleInteraction = async (type: 'like' | 'recast' | 'comment') => {
    // Update interaction count
    setInteractions(prev => ({
      ...prev,
      [type === 'like' ? 'likes' : type === 'recast' ? 'recasts' : 'comments']: 
        prev[type === 'like' ? 'likes' : type === 'recast' ? 'recasts' : 'comments'] + 1
    }))

    // Try real payment first, fallback to simulation
    if (isInitialized) {
      await handleRealTipPayment(type)
    } else {
      simulateTip(type)
    }
    
    onEngagement(type)
  }

  return (
    <div className="space-y-6">
      {/* Mock Farcaster Post */}
      <div className="card">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">AC</span>
            </div>
            <div>
              <div className="font-medium">AutoTip Creator</div>
              <div className="text-sm text-text/60">@autotip-creator • 2h</div>
            </div>
          </div>
          
          <div className="text-body mb-4">
            🎉 Just launched my new project on Base! Really excited to share this with the community. 
            What do you think? Your engagement helps support creators like me! ⚡
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-md p-3 mb-4">
            <div className="flex items-center gap-2 text-accent text-sm">
              <Coins className="w-4 h-4" />
              <span>This post rewards engagement with USDC tips!</span>
            </div>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-6 pt-3 border-t border-border">
          <button
            onClick={() => handleInteraction('like')}
            disabled={processingInteraction === 'like'}
            className="flex items-center gap-2 text-text/60 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            {processingInteraction === 'like' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span className="text-sm">{interactions.likes}</span>
          </button>
          
          <button
            onClick={() => handleInteraction('recast')}
            disabled={processingInteraction === 'recast'}
            className="flex items-center gap-2 text-text/60 hover:text-green-400 transition-colors disabled:opacity-50"
          >
            {processingInteraction === 'recast' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
            <span className="text-sm">{interactions.recasts}</span>
          </button>
          
          <button
            onClick={() => handleInteraction('comment')}
            disabled={processingInteraction === 'comment'}
            className="flex items-center gap-2 text-text/60 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            {processingInteraction === 'comment' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{interactions.comments}</span>
          </button>
        </div>
      </div>

      {/* Payment Error */}
      {error && (
        <Alert variant="error">
          <div>
            <div className="font-medium">Payment Failed</div>
            <div className="text-sm mt-1">
              {parsePaymentError(error).userMessage}
            </div>
          </div>
        </Alert>
      )}

      {/* Tip Notification */}
      {recentTip && (
        <Alert variant="success" className="animate-slide-up">
          <div>
            <div className="font-medium">
              {isInitialized ? 'Tip sent successfully! 🎉' : 'You received a tip! 🎉'}
            </div>
            <div className="text-sm mt-1">
              {recentTip.amount} USDC for your {recentTip.interactionType}
              {recentTip.transactionHash && (
                <span>
                  {' • '}
                  <a 
                    href={`${X402_CONFIG.blockExplorerUrl}/tx/${recentTip.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View Transaction
                  </a>
                </span>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Payment Status Info */}
      <Alert variant={isInitialized ? "success" : "info"}>
        <div>
          <div className="font-medium">
            {isInitialized ? 'Real Payments Enabled' : 'Demo Mode'}
          </div>
          <div className="text-sm mt-1">
            {isInitialized 
              ? 'Your interactions will trigger real USDC payments on Base network.'
              : 'Connect your wallet to enable real USDC payments for interactions.'
            }
          </div>
        </div>
      </Alert>
    </div>
  )
}
