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
    <div className="space-y-8">
      {/* Enhanced Analytics Overview */}
      <div className="space-y-4">
        <h2 className="text-display-sm text-text mb-4">Analytics Overview</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="analytics-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-text-muted">Total Tips Sent</span>
                  <div className="text-display">{analytics.totalTips}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-success-light bg-success/10 px-2 py-1 rounded-full">
                  {analytics.engagementIncrease}
                </div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-sm text-text-muted">Total Value</span>
                  <div className="text-display">{analytics.totalAmount} USDC</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">
                  ~${(parseFloat(analytics.totalAmount) * 1.0).toFixed(2)} USD
                </div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <span className="text-sm text-text-muted">Active Configs</span>
                  <div className="text-display">{analytics.activeConfigs}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">
                  {analytics.activeConfigs > 0 ? 'Running' : 'Setup needed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Configurator */}
      <div data-tip-configurator>
        <TipConfigurator onSave={handleConfigSave} isLoading={isLoading} />
      </div>

      {/* Active Configurations */}
      {activeConfigs.length > 0 ? (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-display-sm">Active Configurations</h3>
          </div>
          
          <div className="space-y-4">
            {activeConfigs.map((config, index) => (
              <div key={index} className="card-highlight">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-text mb-1">Post: {config.postId}</div>
                    <div className="text-sm text-text-muted mb-2">
                      {config.tipAmount} {config.tokenSymbol} per {config.interactionTypes.join(', ')}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.isActive ? 'bg-success animate-pulse-soft' : 'bg-text-muted'}`}></div>
                      <span className="text-xs text-text-muted">
                        {config.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={config.isActive ? 'success' : 'secondary'}
                    onClick={() => toggleConfigStatus(index)}
                    className="text-sm px-4 py-2 min-h-[36px]"
                  >
                    {config.isActive ? 'Running' : 'Paused'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-8">
          <div className="w-16 h-16 bg-text-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-display-sm mb-2">No Active Configurations</h3>
          <p className="text-text-muted mb-4">
            Create your first tip configuration to start rewarding engagement
          </p>
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
