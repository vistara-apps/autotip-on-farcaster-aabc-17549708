
'use client'

import { useState } from 'react'
import { TipConfigurator } from './TipConfigurator'
import { TransactionFeedback } from './TransactionFeedback'
import { Button } from './Button'
import { Alert } from './Alert'
import { TipConfiguration, TransactionLog } from '../types'
import { BarChart3, Users, Coins, TrendingUp } from 'lucide-react'

interface CreatorDashboardProps {
  onConfigSave: (config: TipConfiguration) => void
}

export function CreatorDashboard({ onConfigSave }: CreatorDashboardProps) {
  const [activeConfigs, setActiveConfigs] = useState<TipConfiguration[]>([])
  const [recentTransaction, setRecentTransaction] = useState<TransactionLog | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data
  const analytics = {
    totalTips: 156,
    totalAmount: '15.60',
    activeConfigs: activeConfigs.length,
    engagementIncrease: '+24%'
  }

  const handleConfigSave = async (config: TipConfiguration) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setActiveConfigs(prev => [...prev, config])
    onConfigSave(config)
    setIsLoading(false)
  }

  const toggleConfigStatus = (index: number) => {
    setActiveConfigs(prev => 
      prev.map((config, i) => 
        i === index ? { ...config, isActive: !config.isActive } : config
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-sm text-text/80">Total Tips</span>
          </div>
          <div className="text-display">{analytics.totalTips}</div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-sm text-text/80">Total Value</span>
          </div>
          <div className="text-display">{analytics.totalAmount} USDC</div>
        </div>
      </div>

      {/* Tip Configurator */}
      <TipConfigurator onSave={handleConfigSave} isLoading={isLoading} />

      {/* Active Configurations */}
      {activeConfigs.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h3 className="text-display">Active Configurations</h3>
          </div>
          
          <div className="space-y-3">
            {activeConfigs.map((config, index) => (
              <div key={index} className="bg-bg rounded-md p-4 border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">Post: {config.postId}</div>
                    <div className="text-sm text-text/80">
                      {config.tipAmount} {config.tokenSymbol} per {config.interactionTypes.join(', ')}
                    </div>
                  </div>
                  <Button
                    variant={config.isActive ? 'primary' : 'secondary'}
                    onClick={() => toggleConfigStatus(index)}
                    className="text-sm px-3 py-1"
                  >
                    {config.isActive ? 'Active' : 'Paused'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Feedback Modal */}
      <TransactionFeedback 
        transaction={recentTransaction} 
        onClose={() => setRecentTransaction(null)} 
      />
    </div>
  )
}
