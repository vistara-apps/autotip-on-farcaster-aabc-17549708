'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWalletClient } from 'wagmi'
import { x402PaymentService, PaymentRequest, PaymentResult } from '../services/x402PaymentService'
import { TransactionLog } from '../types'

export interface UseX402PaymentReturn {
  isInitialized: boolean
  isProcessing: boolean
  processTipPayment: (request: PaymentRequest) => Promise<PaymentResult>
  lastTransaction: TransactionLog | null
  error: string | null
  clearError: () => void
}

export function useX402Payment(): UseX402PaymentReturn {
  const { data: walletClient } = useWalletClient()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<TransactionLog | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize the payment service when wallet client is available
  useEffect(() => {
    if (walletClient && !isInitialized) {
      try {
        x402PaymentService.initialize(walletClient)
        setIsInitialized(true)
        setError(null)
      } catch (err: any) {
        console.error('Failed to initialize x402 payment service:', err)
        setError('Failed to initialize payment service')
        setIsInitialized(false)
      }
    } else if (!walletClient && isInitialized) {
      setIsInitialized(false)
    }
  }, [walletClient, isInitialized])

  const processTipPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult> => {
    if (!isInitialized) {
      const result: PaymentResult = {
        success: false,
        error: 'Payment service not initialized. Please connect your wallet.'
      }
      setError(result.error!)
      return result
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await x402PaymentService.processTipPayment(request)
      
      if (result.success && result.transactionLog) {
        setLastTransaction(result.transactionLog)
      } else if (!result.success && result.error) {
        setError(result.error)
      }

      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Unexpected error during payment processing'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsProcessing(false)
    }
  }, [isInitialized])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isInitialized,
    isProcessing,
    processTipPayment,
    lastTransaction,
    error,
    clearError
  }
}

