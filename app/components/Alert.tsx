
'use client'

import { ReactNode } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'

interface AlertProps {
  children: ReactNode
  variant: 'success' | 'error' | 'info'
  className?: string
}

export function Alert({ children, variant, className = '' }: AlertProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }

  const variantClasses = {
    success: 'alert-success',
    error: 'alert-error', 
    info: 'alert-info'
  }

  return (
    <div className={`${variantClasses[variant]} ${className} flex items-center gap-3`}>
      {icons[variant]}
      <div>{children}</div>
    </div>
  )
}
