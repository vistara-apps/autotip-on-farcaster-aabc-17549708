
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

  // Primary button for mode switching
  usePrimaryButton(
    { 
      text: viewMode === 'creator' ? 'SWITCH TO USER VIEW' : 'SWITCH TO CREATOR VIEW' 
    },
    () => {
      setViewMode(viewMode === 'creator' ? 'user' : 'creator')
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
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-display">AutoTip</h1>
              <p className="text-sm text-text/60">Reward engagement with tips</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {context && !context.client.added && (
              <Button
                onClick={handleAddFrame}
                variant="outline"
                className="text-xs px-2 py-1"
              >
                SAVE
              </Button>
            )}
            
            <Button
              onClick={() => openUrl('https://base.org')}
              variant="outline"
              className="text-xs px-2 py-1"
            >
              BASE
            </Button>
          </div>
        </header>

        {/* Mode Toggle */}
        <div className="flex bg-surface rounded-lg p-1 mb-6">
          <button
            onClick={() => setViewMode('creator')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all duration-200 text-sm font-medium ${
              viewMode === 'creator' 
                ? 'bg-primary text-white' 
                : 'text-text/60 hover:text-text'
            }`}
          >
            <Settings className="w-4 h-4" />
            Creator
          </button>
          <button
            onClick={() => setViewMode('user')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all duration-200 text-sm font-medium ${
              viewMode === 'user' 
                ? 'bg-primary text-white' 
                : 'text-text/60 hover:text-text'
            }`}
          >
            <Users className="w-4 h-4" />
            User
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

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => viewProfile()}
              variant="outline"
              className="text-sm"
            >
              View Profile
            </Button>
            
            <Button
              onClick={() => openUrl('https://docs.base.org/mini-apps')}
              variant="outline"
              className="text-sm"
            >
              Built with MiniKit
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
