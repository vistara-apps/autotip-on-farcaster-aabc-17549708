
'use client'

interface InputWithLabelProps {
  label: string
  type?: 'text' | 'number'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function InputWithLabel({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false
}: InputWithLabelProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full input-field"
      />
    </div>
  )
}
