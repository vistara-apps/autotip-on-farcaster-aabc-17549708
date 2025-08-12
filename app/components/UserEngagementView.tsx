
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
            className="flex items-center gap-2 text-text/60 hover:text-red-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm">{interactions.likes}</span>
          </button>
          
          <button
            onClick={() => handleInteraction('recast')}
            className="flex items-center gap-2 text-text/60 hover:text-green-400 transition-colors"
          >
            <Repeat className="w-5 h-5" />
            <span className="text-sm">{interactions.recasts}</span>
          </button>
          
          <button
            onClick={() => handleInteraction('comment')}
            className="flex items-center gap-2 text-text/60 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{interactions.comments}</span>
          </button>
        </div>
      </div>

      {/* Tip Notification */}
      {recentTip && (
        <Alert variant="success" className="animate-slide-up">
          <div>
            <div className="font-medium">You received a tip! 🎉</div>
            <div className="text-sm mt-1">
              {recentTip.amount} USDC for your {recentTip.interactionType}
            </div>
          </div>
        </Alert>
      )}

      {/* Demo Info */}
      <Alert variant="info">
        <div>
          <div className="font-medium">Demo Mode</div>
          <div className="text-sm mt-1">
            This is a demonstration of the AutoTip functionality. In production, 
            real USDC would be transferred for each interaction.
          </div>
        </div>
      </Alert>
    </div>
  )
}
