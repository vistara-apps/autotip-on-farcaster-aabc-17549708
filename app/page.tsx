'use client'

import { useEffect, useState } from 'react'
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  usePrimaryButton,
  useViewProfile,
  useNotification
} from '@coinbase/onchainkit/minikit'
import { CreatorDashboard } from './components/CreatorDashboard'
import { UserEngagementView } from './components/UserEngagementView'
import { Button } from './components/Button'
import { TipConfiguration } from './types'
import { Users, Settings, Zap } from 'lucide-react'

export default function AutoTipApp() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const [viewMode, setViewMode] = useState<'creator' | 'user'>('creator')
  const [activeConfig, setActiveConfig] = useState<TipConfiguration | null>(null)
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  const viewProfile = useViewProfile()
  const sendNotification = useNotification()

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  // Primary button for quick actions
  usePrimaryButton(
    { 
      text: viewMode === 'creator' ? 'CREATE NEW TIP CONFIG' : 'ENGAGE WITH POST' 
    },
    () => {
      if (viewMode === 'creator') {
        // Scroll to tip configurator or focus on it
        const configurator = document.querySelector('[data-tip-configurator]')
        if (configurator) {
          configurator.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // Simulate engagement with the post
        handleEngagement('like')
      }
    }
  )

  const handleAddFrame = async () => {
    const result = await addFrame()
    if (result) {
      console.log('Frame added:', result.url, result.token)
      await sendNotification({
        title: 'AutoTip Added! 🎉',
        body: 'You can now access AutoTip from your mini apps.'
      })
    }
  }

  const handleConfigSave = (config: TipConfiguration) => {
    setActiveConfig(config)
    console.log('Tip configuration saved:', config)
  }

  const handleEngagement = async (type: 'like' | 'recast' | 'comment') => {
    console.log('User engaged with:', type)
    
    if (activeConfig) {
      await sendNotification({
        title: 'Tip Sent! 💰',
        body: `You received ${activeConfig.tipAmount} USDC for your ${type}!`
      })
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-display-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AutoTip
                </h1>
                <p className="text-text-muted">Reward engagement with USDC tips</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {context && !context.client.added && (
                <Button
                  onClick={handleAddFrame}
                  variant="outline"
                  className="text-sm px-4 py-2 min-h-[36px]"
                >
                  Save App
                </Button>
              )}
              
              <Button
                onClick={() => openUrl('https://base.org')}
                variant="ghost"
                className="text-sm px-3 py-2 min-h-[36px]"
              >
                Built on Base
              </Button>
            </div>
          </div>

          {/* Enhanced Status Indicator */}
          {context && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-accent-light text-sm">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse-soft"></div>
                <span>
                  {context.client.added ? 'App installed and ready!' : 'Ready to configure tips'}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Enhanced Mode Toggle */}
        <div className="mode-toggle mb-8">
          <button
            onClick={() => setViewMode('creator')}
            className={`mode-toggle-button ${viewMode === 'creator' ? 'active' : 'inactive'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Creator Dashboard</span>
          </button>
          <button
            onClick={() => setViewMode('user')}
            className={`mode-toggle-button ${viewMode === 'user' ? 'active' : 'inactive'}`}
          >
            <Users className="w-5 h-5" />
            <span>User Experience</span>
          </button>
        </div>

        {/* Main Content */}
        <main>
          {viewMode === 'creator' ? (
            <CreatorDashboard onConfigSave={handleConfigSave} />
          ) : (
            <UserEngagementView 
              postId="sample-post-123"
              onEngagement={handleEngagement}
            />
          )}
        </main>

        {/* Enhanced Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => viewProfile()}
              variant="ghost"
              className="text-sm flex-1"
            >
              <Users className="w-4 h-4" />
              View Profile
            </Button>
            
            <Button
              onClick={() => openUrl('https://docs.base.org/mini-apps')}
              variant="ghost"
              className="text-sm flex-1"
            >
              <Zap className="w-4 h-4" />
              MiniKit Docs
            </Button>
          </div>
          
          <div className="text-center mt-4 text-xs text-text-muted">
            Powered by Base • Built with OnchainKit
          </div>
        </footer>
      </div>
    </div>
  )
}
