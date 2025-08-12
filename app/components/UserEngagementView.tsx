'use client'

import { useState, useEffect } from 'react'
import { Alert } from './Alert'
import { Button } from './Button'
import { TransactionLog } from '../types'
import { Heart, Repeat, MessageCircle, Coins } from 'lucide-react'

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

  // Simulate receiving a tip
  const simulateTip = (interactionType: 'like' | 'recast' | 'comment') => {
    const mockTransaction: TransactionLog = {
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      senderFid: 12345,
      receiverFid: 67890,
      amount: '0.01',
      tokenAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC on Base
      interactionType,
      timestamp: new Date(),
      status: 'success'
    }

    setRecentTip(mockTransaction)
    setTimeout(() => setRecentTip(null), 5000)
  }

  const handleInteraction = (type: 'like' | 'recast' | 'comment') => {
    // Update interaction count
    setInteractions(prev => ({
      ...prev,
      [type === 'like' ? 'likes' : type === 'recast' ? 'recasts' : 'comments']: 
        prev[type === 'like' ? 'likes' : type === 'recast' ? 'recasts' : 'comments'] + 1
    }))

    // Trigger tip simulation
    simulateTip(type)
    onEngagement(type)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Mock Farcaster Post */}
      <div className="card-highlight">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AC</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-text">AutoTip Creator</div>
              <div className="text-sm text-text-muted">@autotip-creator • 2h ago</div>
            </div>
            <div className="text-xs text-success-light bg-success/10 px-2 py-1 rounded-full">
              Tips Enabled
            </div>
          </div>
          
          <div className="text-body mb-6 leading-relaxed">
            🎉 Just launched my new project on Base! Really excited to share this with the community. 
            What do you think? Your engagement helps support creators like me! ⚡
          </div>
          
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-accent-light">Tip-Enabled Post</div>
                <div className="text-sm text-text-muted">Earn 0.01 USDC for each interaction!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Interaction Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border-light">
          <button
            onClick={() => handleInteraction('like')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 min-h-[44px] flex-1 justify-center"
          >
            <Heart className="w-6 h-6" />
            <span className="font-medium">{interactions.likes}</span>
          </button>
          
          <button
            onClick={() => handleInteraction('recast')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-green-400 hover:bg-green-400/10 transition-all duration-200 min-h-[44px] flex-1 justify-center"
          >
            <Repeat className="w-6 h-6" />
            <span className="font-medium">{interactions.recasts}</span>
          </button>
          
          <button
            onClick={() => handleInteraction('comment')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200 min-h-[44px] flex-1 justify-center"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-medium">{interactions.comments}</span>
          </button>
        </div>
      </div>

      {/* Enhanced Tip Notification */}
      {recentTip && (
        <div className="animate-bounce-gentle">
          <Alert variant="success" className="animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-success-light" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-success-light text-lg">Tip Received! 🎉</div>
                <div className="text-sm mt-1 text-success/80">
                  You earned {recentTip.amount} USDC for your {recentTip.interactionType}!
                </div>
                <div className="text-xs mt-2 text-success/60">
                  Transaction: {recentTip.transactionHash.slice(0, 10)}...
                </div>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Enhanced Demo Info */}
      <Alert variant="info">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Coins className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="font-semibold text-accent-light">Demo Mode Active</div>
            <div className="text-sm mt-2 text-accent/80 leading-relaxed">
              This is a demonstration of AutoTip functionality. In production, real USDC 
              would be transferred instantly to your wallet for each interaction. Try clicking 
              the buttons above to see how tips work!
            </div>
          </div>
        </div>
      </Alert>
    </div>
  )
}
