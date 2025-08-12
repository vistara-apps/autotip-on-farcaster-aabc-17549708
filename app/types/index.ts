
export interface CreatorConfig {
  creatorFid: number
  postId: string
  tipAmount: string
  tokenAddress: string
  interactionType: 'like' | 'recast' | 'comment'
  isActive: boolean
}

export interface TransactionLog {
  transactionHash: string
  senderFid: number
  receiverFid: number
  amount: string
  tokenAddress: string
  interactionType: 'like' | 'recast' | 'comment'
  timestamp: Date
  status: 'processing' | 'success' | 'failed'
}

export interface TipConfiguration {
  postId: string
  tipAmount: string
  tokenSymbol: string
  interactionTypes: string[]
  isActive: boolean
}
