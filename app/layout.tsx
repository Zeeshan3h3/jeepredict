import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jeepredict.in'
  ),

  title: {
    default:  'JEEPredict 2026 — Free JEE Advanced Rank Predictor',
    template: '%s | JEEPredict 2026'
  },

  description:
    'Predict your JEE Advanced 2026 rank instantly. Enter your marks ' +
    'and get your predicted rank + IIT, NIT & IIIT college matches ' +
    'based on official 2025 JoSAA cutoff data. 100% free, no login.',

  keywords: [
    'JEE Advanced 2026 rank predictor',
    'JEE Advanced marks vs rank 2026',
    'IIT college predictor 2026',
    'JoSAA cutoff 2026',
    'JEE Advanced rank calculator',
    'IIT rank predictor',
    'JEE Advanced 2026 result rank',
    'JoSAA college predictor 2026',
    'IIT Bombay cutoff 2026',
    'IIT Delhi cutoff 2026',
    'NIT cutoff 2026',
    'JEE Advanced category rank predictor',
    'OBC JEE rank predictor',
    'SC ST JEE rank predictor',
    'what rank will I get in JEE Advanced 2026',
    'JEE Advanced marks to rank converter'
  ],

  authors:   [{ name: 'JEEPredict', url: 'https://jeepredict.in' }],
  creator:   'JEEPredict',
  publisher: 'JEEPredict',

  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/' }
  },

  robots: {
    index:               true,
    follow:              true,
    nocache:             false,
    googleBot: {
      index:             true,
      follow:            true,
      noimageindex:      false,
      'max-video-preview':  -1,
      'max-image-preview':  'large',
      'max-snippet':        -1
    }
  },

  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         '/',
    siteName:    'JEEPredict 2026',
    title:       'JEEPredict 2026 — Free JEE Advanced Rank Predictor',
    description:
      'Enter your JEE Advanced 2026 marks and instantly get your ' +
      'predicted rank + top IIT, NIT & IIIT college matches. ' +
      'Based on official 2025 JoSAA data. Free. No login.',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'JEEPredict 2026 — Free JEE Advanced Rank Predictor',
        type:   'image/png'
      }
    ]
  },

  twitter: {
    card:        'summary_large_image',
    title:       'JEEPredict 2026 — Free JEE Advanced Rank Predictor',
    description:
      'Predict your JEE Advanced 2026 rank instantly. ' +
      'Free IIT, NIT & IIIT college matches based on 2025 JoSAA data.',
    images:      ['/og-image.png'],
    creator:     '@jeepredict'
  },

  applicationName: 'JEEPredict 2026',
  category:        'Education',
  classification:  'Education / College Admissions',

  verification: {
    google: 'jun8GHqP-CkDPssSMXkIeF1mxkSbkyab43Ghdicjmf0',
    yandex: 'REPLACE_WITH_YANDEX_TOKEN'
  },

  referrer:  'origin-when-cross-origin',
  formatDetection: {
    email:     false,
    address:   false,
    telephone: false
  },

  icons: {
    icon: [
      { url: '/favicon.ico',              sizes: 'any' },
      { url: '/icon-16.png',  type: 'image/png', sizes: '16x16' },
      { url: '/icon-32.png',  type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' }
    ],
    apple:    [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico']
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN" dir="ltr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            JEEPredict requires JavaScript to run the rank predictor.
            Please enable JavaScript in your browser.
          </div>
        </noscript>
        {children}
      </body>
    </html>
  )
}
