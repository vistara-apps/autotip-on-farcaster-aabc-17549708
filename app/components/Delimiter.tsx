
'use client'

interface DelimiterProps {
  variant?: 'horizontal'
  className?: string
}

export function Delimiter({ variant = 'horizontal', className = '' }: DelimiterProps) {
  return (
    <div className={`border-border ${variant === 'horizontal' ? 'border-t w-full' : 'border-l h-full'} ${className}`} />
  )
}
