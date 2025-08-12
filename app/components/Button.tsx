'use client'

import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'ghost'
  disabled?: boolean
  className?: string
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = ''
}: ButtonProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'btn-primary'
      case 'secondary':
        return 'btn-secondary'
      case 'outline':
        return 'btn-outline'
      case 'success':
        return 'btn-success'
      case 'ghost':
        return 'btn-ghost'
      default:
        return 'btn-primary'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantClasses(variant)} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
