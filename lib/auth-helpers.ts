import { supabase } from '@/lib/supabase-client'

// ── Phone formatting ──────────────────────────────────────────────
export function formatPhone(raw: string): string {
  let cleaned = raw.replace(/\D/g, '')
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2)
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1)
  }
  return '+91' + cleaned
}

export function isValidIndianPhone(raw: string): boolean {
  const cleaned = raw.replace(/\D/g, '').replace(/^91/, '').replace(/^0/, '')
  return /^[6-9]\d{9}$/.test(cleaned)
}

// ── OTP helpers ───────────────────────────────────────────────────
export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    phone: formatPhone(phone),
  })
  return { error: error?.message ?? null }
}

export async function verifyOTP(
  phone: string,
  token: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.verifyOtp({
    phone: formatPhone(phone),
    token,
    type: 'sms',
  })
  return { error: error?.message ?? null }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
