/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ArrowLeft, CheckCircle2 } from 'lucide-react'
import OTPInput from './OTPInput'
import { sendOTP, verifyOTP, isValidIndianPhone } from '@/lib/auth-helpers'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (student: { name: string; phone: string }) => void
  prefillData?: {
    marks: number
    category: string
    gender: string
    predicted_rank: number
  }
}

type Step = 'intro' | 'phone' | 'otp' | 'profile' | 'success'

const STEP_PROGRESS: Record<Step, number> = {
  intro: 0,
  phone: 1,
  otp: 2,
  profile: 3,
  success: 3,
}

const STEP_WIDTH: Record<Step, string> = {
  intro: '0%',
  phone: '33%',
  otp: '66%',
  profile: '100%',
  success: '100%',
}

export function AuthModal({ isOpen, onClose, onSuccess, prefillData }: AuthModalProps) {
  const [step, setStep] = useState<Step>('intro')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('intro')
      setPhone('')
      setOtp('')
      setName('')
      setEmail('')
      setError(null)
      setIsLoading(false)
      setCountdown(0)
    }
  }, [isOpen])

  // Countdown timer
  const startCountdown = useCallback((n: number) => {
    setCountdown(n)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleSendOTP = useCallback(async () => {
    if (!isValidIndianPhone(phone)) return
    setIsLoading(true)
    setError(null)
    const { error: err } = await sendOTP(phone)
    setIsLoading(false)
    if (err) {
      setError(err)
      return
    }
    setStep('otp')
    startCountdown(30)
  }, [phone, startCountdown])

  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== 6) return
    setIsLoading(true)
    setError(null)
    const { error: err } = await verifyOTP(phone, otp)
    setIsLoading(false)
    if (err) {
      setError('Invalid OTP. Please try again.')
      setOtp('')
      return
    }
    setStep('profile')
  }, [otp, phone])

  const handleSaveProfile = useCallback(async () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/student/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          marks: prefillData?.marks ?? null,
          category: prefillData?.category ?? null,
          gender: prefillData?.gender ?? null,
          predicted_rank: prefillData?.predicted_rank ?? null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save. Please try again.')
        return
      }
      setStep('success')
      onSuccess({ name: name.trim(), phone })
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [name, email, prefillData, phone, onSuccess])

  // Backdrop close — only on intro/phone steps
  const handleBackdropClick = () => {
    if (step === 'intro' || step === 'phone') onClose()
  }

  if (!isOpen) return null

  const showProgress = step !== 'intro'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal card */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes scaleIn {
            0%   { transform: scale(0); }
            70%  { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes fillBar {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
        >
          <X size={16} className="text-gray-500" />
        </button>

        {/* Progress bar (all steps except intro) */}
        {showProgress && (
          <div>
            <div className="w-full h-1 bg-gray-100">
              <div
                className="bg-[#FF6B35] h-full transition-all duration-500"
                style={{ width: STEP_WIDTH[step] }}
              />
            </div>
            <div className="flex justify-between px-6 py-2">
              {(['phone', 'otp', 'profile'] as const).map((s, i) => {
                const labels = ['📱 Phone', '🔐 Verify', '👤 Profile']
                const done = STEP_PROGRESS[step] > i + 1
                const active = STEP_PROGRESS[step] === i + 1
                return (
                  <span
                    key={s}
                    className={`text-xs ${
                      active
                        ? 'text-[#FF6B35] font-semibold'
                        : done
                        ? 'text-green-600'
                        : 'text-gray-300'
                    }`}
                  >
                    {done ? '✓' : labels[i]}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP: intro ─────────────────────────────────── */}
        {step === 'intro' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto text-5xl">
              🎓
            </div>
            <h2 className="text-2xl font-black text-[#0F1B4C] mt-4">
              Unlock Your Full College List
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter your WhatsApp number to get:
            </p>
            <ul className="text-left mt-4 space-y-2">
              {[
                'Full list of 200+ eligible colleges',
                'Personalized JoSAA choice filling order',
                'Branch-wise analysis for your rank',
                'Expert counselling session (optional)',
                'JoSAA round-wise seat availability alerts',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 text-sm flex-shrink-0 mt-0.5">✅</span>
                  <span className="text-[#0F1B4C] text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 rounded-xl p-3 mt-4">
              <p className="text-gray-400 text-xs text-center">
                🔒 Your number is only used for JEEPredict updates. We never share it. No spam, ever.
              </p>
            </div>
            <button
              onClick={() => setStep('phone')}
              className="w-full mt-6 py-4 bg-[#FF6B35] text-white text-base font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              Continue with WhatsApp →
            </button>
            <p
              className="text-gray-400 text-xs underline cursor-pointer text-center mt-3"
              onClick={onClose}
            >
              Skip for now
            </p>
          </div>
        )}

        {/* ── STEP: phone ─────────────────────────────────── */}
        {step === 'phone' && (
          <div>
            <div className="p-6 pb-0">
              <button
                onClick={() => { setStep('intro'); setError(null) }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-[#0F1B4C] mt-4">
                Enter Your WhatsApp Number
              </h2>
              <p className="text-gray-500 text-sm mt-1">We&apos;ll send a 6-digit OTP to verify</p>
            </div>
            <div className="p-6">
              <div className="flex items-center border border-[#E2E8F4] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent transition">
                <div className="bg-gray-50 px-3 py-3 border-r border-[#E2E8F4] flex items-center gap-1 flex-shrink-0">
                  <span>🇮🇳</span>
                  <span className="text-sm font-medium text-[#0F1B4C]">+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength={10}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  className="flex-1 px-3 py-3 text-sm outline-none text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>

              {/* Live validation */}
              {phone.length > 0 && !isValidIndianPhone(phone) && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠️ Enter a valid 10-digit Indian mobile number
                </p>
              )}
              {phone.length === 10 && isValidIndianPhone(phone) && (
                <p className="text-green-600 text-xs mt-1">✓ Looks good!</p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={!isValidIndianPhone(phone) || isLoading}
                className="w-full mt-4 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP →'
                )}
              </button>

              <p className="text-gray-400 text-xs text-center mt-3">
                By continuing, you agree to receive SMS from JEEPredict.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP: otp ───────────────────────────────────── */}
        {step === 'otp' && (
          <div>
            <div className="p-6 pb-0">
              <button
                onClick={() => { setStep('phone'); setOtp(''); setError(null) }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-[#0F1B4C] mt-4">Enter the OTP</h2>
              <p className="text-gray-500 text-sm mt-1">
                Sent to +91 {phone}&nbsp;·&nbsp;
                <span
                  className="text-[#FF6B35] text-xs underline cursor-pointer"
                  onClick={() => { setStep('phone'); setOtp(''); setError(null) }}
                >
                  Wrong number?
                </span>
              </p>
            </div>
            <div className="p-6">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                onComplete={handleVerifyOTP}
                error={!!error}
              />

              {error && (
                <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={otp.length < 6 || isLoading}
                className="w-full mt-4 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP →'
                )}
              </button>

              <div className="text-center mt-3">
                {countdown > 0 ? (
                  <p className="text-gray-400 text-xs">Resend OTP in {countdown}s</p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Didn&apos;t receive OTP?{' '}
                    <span
                      onClick={handleSendOTP}
                      className="text-[#FF6B35] underline cursor-pointer"
                    >
                      Resend
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: profile ───────────────────────────────── */}
        {step === 'profile' && (
          <div>
            <div className="p-6 pb-0">
              <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center gap-2 w-fit">
                <span className="text-green-600 text-xs">✅</span>
                <span className="text-green-700 text-xs font-medium">
                  Number verified! +91 {phone}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#0F1B4C] mt-4">
                Almost done! Tell us your name
              </h2>
              <p className="text-gray-500 text-sm mt-1">This personalizes your college list</p>
            </div>
            <div className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0F1B4C] mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arjun Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={e => setName(e.target.value.trim())}
                  className="w-full border border-[#E2E8F4] rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                />
              </div>

              {/* Email (optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0F1B4C] mb-1 flex items-center gap-1.5">
                  Email Address
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full">
                    Optional
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-[#E2E8F4] rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                />
                <p className="text-gray-400 text-xs mt-1">For your personalized PDF report</p>
              </div>

              {/* Pre-filled prediction summary */}
              {prefillData && (
                <div className="bg-[#F5F7FF] rounded-xl p-4 border border-[#E2E8F4]">
                  <p className="text-xs text-gray-400 font-medium mb-2">Your prediction details</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Marks', value: `${prefillData.marks} / 360` },
                      { label: 'Category', value: prefillData.category },
                      { label: 'Gender', value: prefillData.gender === 'gender-neutral' ? 'Gender Neutral' : 'Female' },
                      { label: 'Rank', value: `#${prefillData.predicted_rank.toLocaleString('en-IN')}` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-gray-400 text-xs">{label}</p>
                        <p className="text-[#0F1B4C] font-semibold text-xs">{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-[10px] mt-2">
                    We&apos;ll save this to your profile automatically
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={!name.trim() || isLoading}
                className="w-full mt-6 py-4 bg-[#FF6B35] text-white text-base font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving your profile...
                  </>
                ) : (
                  'Save & View My Colleges →'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: success ───────────────────────────────── */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div
              className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center"
              style={{ animation: 'scaleIn 0.5s ease-out' }}
            >
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-[#0F1B4C] mt-6">You&apos;re all set! 🎉</h2>
            <p className="text-gray-500 text-sm mt-2">
              Welcome, {name}! Your personalized college list is ready.
            </p>
            <p className="text-gray-400 text-xs mt-4">Taking you to your dashboard...</p>
            <div className="w-48 h-1 bg-gray-100 rounded-full mx-auto mt-2 overflow-hidden">
              <div
                className="bg-[#FF6B35] h-full rounded-full"
                style={{ animation: 'fillBar 1.5s linear forwards' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
