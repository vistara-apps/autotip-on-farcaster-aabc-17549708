'use client'

import { ReactNode } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertProps {
  children: ReactNode
  variant: 'success' | 'error' | 'info' | 'warning'
  className?: string
}

export function Alert({ children, variant, className = '' }: AlertProps) {
  const variantClasses = {
    success: 'alert-success',
    error: 'alert-error', 
    info: 'alert-info',
    warning: 'alert-warning'
  }

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}
