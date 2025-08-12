
'use client'

import { useState, useEffect } from 'react'
import { Alert } from './Alert'
import { Button } from './Button'
import { TransactionLog } from '../types'
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react'

interface TransactionFeedbackProps {
  transaction: TransactionLog | null
  onClose?: () => void
}

export function TransactionFeedback({ transaction, onClose }: TransactionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (transaction) {
      setIsVisible(true)
    }
  }, [transaction])

  if (!transaction || !isVisible) {
    return null
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'processing':
        return <Clock className="w-5 h-5 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'failed':
        return <XCircle className="w-5 h-5" />
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'processing':
        return 'info'
      case 'success':
        return 'success'
      case 'failed':
        return 'error'
    }
  }

  const getStatusMessage = () => {
    switch (transaction.status) {
      case 'processing':
        return 'Transaction is being processed...'
      case 'success':
        return `Successfully sent ${transaction.amount} USDC tip!`
      case 'failed':
        return 'Transaction failed. Please try again.'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="card max-w-md w-full animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon()}
          <h3 className="text-display">Transaction Update</h3>
        </div>

        <Alert variant={getStatusColor() as 'success' | 'error' | 'info'} className="mb-4">
          {getStatusMessage()}
        </Alert>

        {transaction.status === 'success' && (
          <div className="space-y-3 mb-4">
            <div className="text-sm text-text/80">
              <span className="font-medium">Amount:</span> {transaction.amount} USDC
            </div>
            <div className="text-sm text-text/80">
              <span className="font-medium">Interaction:</span> {transaction.interactionType}
            </div>
            <div className="text-sm text-text/80 break-all">
              <span className="font-medium">Transaction:</span> {transaction.transactionHash}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {transaction.status === 'success' && (
            <Button
              variant="outline"
              onClick={() => window.open(`https://basescan.org/tx/${transaction.transactionHash}`, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Basescan
            </Button>
          )}
          <Button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
