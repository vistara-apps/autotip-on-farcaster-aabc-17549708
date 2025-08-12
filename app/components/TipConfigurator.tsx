'use client'

import { useState } from 'react'
import { InputWithLabel } from './InputWithLabel'
import { Button } from './Button'
import { Alert } from './Alert'
import { TipConfiguration } from '../types'
import { useX402Payment } from '../hooks/useX402Payment'
import { parsePaymentError } from '../utils/errorHandling'
import { Coins, Settings, Wallet } from 'lucide-react'

interface TipConfiguratorProps {
  onSave: (config: TipConfiguration) => void
  isLoading?: boolean
}

export function TipConfigurator({ onSave, isLoading = false }: TipConfiguratorProps) {
  const [postId, setPostId] = useState('')
  const [tipAmount, setTipAmount] = useState('0.01')
  const [tokenSymbol] = useState('USDC')
  const [selectedInteractions, setSelectedInteractions] = useState<string[]>(['like'])
  const [showSuccess, setShowSuccess] = useState(false)
  
  // x402 payment integration
  const { isInitialized, error: paymentError, clearError } = useX402Payment()
  const [configError, setConfigError] = useState<string | null>(null)

  const interactionTypes = [
    { id: 'like', label: 'Likes', icon: '❤️' },
    { id: 'recast', label: 'Recasts', icon: '🔄' },
    { id: 'comment', label: 'Comments', icon: '💬' }
  ]

  const handleInteractionToggle = (interactionId: string) => {
    setSelectedInteractions(prev => 
      prev.includes(interactionId)
        ? prev.filter(id => id !== interactionId)
        : [...prev, interactionId]
    )
  }

  const handleSave = () => {
    // Clear any previous errors
    setConfigError(null)
    clearError()

    // Validate inputs
    if (!postId || !tipAmount || selectedInteractions.length === 0) {
      setConfigError('Please fill in all required fields')
      return
    }

    // Validate tip amount
    const amount = parseFloat(tipAmount)
    if (isNaN(amount) || amount <= 0) {
      setConfigError('Please enter a valid tip amount')
      return
    }

    if (amount > 1.0) {
      setConfigError('Tip amount cannot exceed $1.00 USDC')
      return
    }

    // Check if payment service is initialized
    if (!isInitialized) {
      setConfigError('Please connect your wallet to enable auto-tipping')
      return
    }

    const config: TipConfiguration = {
      postId,
      tipAmount,
      tokenSymbol,
      interactionTypes: selectedInteractions,
      isActive: true
    }

    onSave(config)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <h2 className="text-display">Configure Auto-Tipping</h2>
      </div>

      <div className="space-y-6">
        {/* Wallet Connection Status */}
        <div className={`flex items-center gap-3 p-3 rounded-md border ${
          isInitialized 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isInitialized ? 'Wallet Connected - Ready for Payments' : 'Connect Wallet to Enable Auto-Tipping'}
          </span>
        </div>

        <InputWithLabel
          label="Farcaster Post ID"
          value={postId}
          onChange={setPostId}
          placeholder="Enter the post ID to enable tipping"
          required
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-text">
            Tip Amount per Interaction <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface border border-border rounded-md px-3 py-2">
              <Coins className="w-5 h-5 text-accent mr-2" />
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                step="0.001"
                min="0.001"
                className="bg-transparent border-none outline-none text-text w-20"
              />
              <span className="text-text/60 ml-2">{tokenSymbol}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-text">
            Trigger Interactions <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {interactionTypes.map((interaction) => (
              <button
                key={interaction.id}
                onClick={() => handleInteractionToggle(interaction.id)}
                className={`p-3 rounded-md border transition-all duration-200 text-sm font-medium ${
                  selectedInteractions.includes(interaction.id)
                    ? 'bg-primary border-primary text-white'
                    : 'bg-surface border-border text-text hover:border-accent'
                }`}
              >
                <div className="text-lg mb-1">{interaction.icon}</div>
                {interaction.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {(configError || paymentError) && (
          <Alert variant="error">
            {configError || paymentError}
          </Alert>
        )}

        {showSuccess && (
          <Alert variant="success">
            Auto-tipping configured successfully! Your post is now set to reward engagement with real USDC payments.
          </Alert>
        )}

        <Button
          onClick={handleSave}
          disabled={!postId || !tipAmount || selectedInteractions.length === 0 || isLoading || !isInitialized}
          className="w-full"
        >
          {isLoading ? 'Saving Configuration...' : 'Enable Auto-Tipping'}
        </Button>
        
        {!isInitialized && (
          <p className="text-sm text-text/60 text-center">
            Connect your wallet to enable real USDC payments for auto-tipping
          </p>
        )}
      </div>
    </div>
  )
}
