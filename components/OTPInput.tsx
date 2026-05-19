'use client'

import { useRef, useCallback } from 'react'

interface OTPInputProps {
  value: string
  onChange: (val: string) => void
  length: number
  onComplete: () => void
  error: boolean
}

export default function OTPInput({ value, onChange, length, onComplete, error }: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const getBoxClass = (idx: number) => {
    const base =
      'w-11 h-12 text-center text-lg font-bold rounded-xl border focus:outline-none transition-all duration-150'
    if (error) return `${base} border-red-400 bg-red-50 text-red-600`
    if (value[idx]) return `${base} border-[#FF6B35] bg-[#FF6B35]/5 text-[#0F1B4C]`
    return `${base} border-[#E2E8F4] bg-white text-[#0F1B4C]`
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const raw = e.target.value.replace(/\D/g, '')
      if (!raw) return
      const digit = raw[raw.length - 1]
      const arr = value.split('')
      arr[idx] = digit
      // Fill remaining if pasted multi-digit
      const newValue = arr.join('').slice(0, length)
      onChange(newValue)
      if (newValue.length === length) {
        setTimeout(onComplete, 100)
      } else {
        inputsRef.current[idx + 1]?.focus()
      }
    },
    [value, onChange, length, onComplete]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === 'Backspace') {
        e.preventDefault()
        const arr = value.split('')
        if (arr[idx]) {
          arr[idx] = ''
          onChange(arr.join(''))
        } else if (idx > 0) {
          const prev = idx - 1
          arr[prev] = ''
          onChange(arr.join(''))
          inputsRef.current[prev]?.focus()
        }
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        inputsRef.current[idx - 1]?.focus()
      } else if (e.key === 'ArrowRight' && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus()
      }
    },
    [value, onChange, length]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      onChange(pasted)
      if (pasted.length === length) {
        setTimeout(onComplete, 100)
        inputsRef.current[length - 1]?.focus()
      } else {
        inputsRef.current[pasted.length]?.focus()
      }
    },
    [onChange, length, onComplete]
  )

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={el => { inputsRef.current[idx] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] ?? ''}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className={getBoxClass(idx)}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}
