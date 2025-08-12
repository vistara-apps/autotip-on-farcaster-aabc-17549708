export interface PaymentError {
  code: string
  message: string
  userMessage: string
  recoverable: boolean
}

export const PAYMENT_ERROR_CODES = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  USER_REJECTED: 'USER_REJECTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

export function parsePaymentError(error: any): PaymentError {
  // Handle wallet connection errors
  if (!error || error.message?.includes('wallet') || error.message?.includes('connect')) {
    return {
      code: PAYMENT_ERROR_CODES.WALLET_NOT_CONNECTED,
      message: error?.message || 'Wallet not connected',
      userMessage: 'Please connect your wallet to make payments.',
      recoverable: true
    }
  }

  // Handle insufficient funds
  if (error.code === 'INSUFFICIENT_FUNDS' || error.message?.includes('insufficient')) {
    return {
      code: PAYMENT_ERROR_CODES.INSUFFICIENT_FUNDS,
      message: error.message,
      userMessage: 'You don\'t have enough USDC to complete this payment.',
      recoverable: true
    }
  }

  // Handle user rejection
  if (error.code === 'USER_REJECTED' || error.message?.includes('rejected') || error.message?.includes('denied')) {
    return {
      code: PAYMENT_ERROR_CODES.USER_REJECTED,
      message: error.message,
      userMessage: 'Payment was cancelled. You can try again anytime.',
      recoverable: true
    }
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('network') || error.message?.includes('connection')) {
    return {
      code: PAYMENT_ERROR_CODES.NETWORK_ERROR,
      message: error.message,
      userMessage: 'Network error occurred. Please check your connection and try again.',
      recoverable: true
    }
  }

  // Handle timeout errors
  if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
    return {
      code: PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT,
      message: error.message,
      userMessage: 'Payment timed out. Please try again.',
      recoverable: true
    }
  }

  // Handle invalid amount errors
  if (error.message?.includes('amount') || error.message?.includes('invalid')) {
    return {
      code: PAYMENT_ERROR_CODES.INVALID_AMOUNT,
      message: error.message,
      userMessage: 'Invalid payment amount. Please check the configuration.',
      recoverable: false
    }
  }

  // Handle service unavailable
  if (error.response?.status >= 500 || error.message?.includes('service')) {
    return {
      code: PAYMENT_ERROR_CODES.SERVICE_UNAVAILABLE,
      message: error.message,
      userMessage: 'Payment service is temporarily unavailable. Please try again later.',
      recoverable: true
    }
  }

  // Default unknown error
  return {
    code: PAYMENT_ERROR_CODES.UNKNOWN_ERROR,
    message: error.message || 'Unknown error occurred',
    userMessage: 'An unexpected error occurred. Please try again.',
    recoverable: true
  }
}

export function getErrorRecoveryAction(errorCode: string): string {
  switch (errorCode) {
    case PAYMENT_ERROR_CODES.WALLET_NOT_CONNECTED:
      return 'Connect Wallet'
    case PAYMENT_ERROR_CODES.INSUFFICIENT_FUNDS:
      return 'Add USDC'
    case PAYMENT_ERROR_CODES.USER_REJECTED:
      return 'Try Again'
    case PAYMENT_ERROR_CODES.NETWORK_ERROR:
      return 'Retry'
    case PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT:
      return 'Retry'
    case PAYMENT_ERROR_CODES.SERVICE_UNAVAILABLE:
      return 'Retry Later'
    default:
      return 'Try Again'
  }
}

