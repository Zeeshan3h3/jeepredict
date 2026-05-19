import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JEEPredict 2026 — Free JEE Advanced Rank Predictor',
  description:
    'Get your JEE Advanced 2026 predicted rank instantly. See your top IIT, NIT & IIIT college matches based on 2025 JoSAA data. 100% free, no login required.',
  keywords: ['JEE Advanced 2026', 'rank predictor', 'JoSAA', 'IIT', 'NIT', 'college predictor'],
  openGraph: {
    title: 'JEEPredict 2026 — Know Your IIT Rank Before Results Day',
    description:
      'Free JEE Advanced rank predictor with personalized college matching across IITs, NITs, and IIITs.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">{children}</body>
    </html>
  )
}
