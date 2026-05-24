'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import PredictorForm from '@/components/PredictorForm'
import RankResult from '@/components/RankResult'
import { AuthModal } from '@/components/AuthModal'
import { CollegeMatch } from '@/types/database'

/* ─── Internal FAQ accordion ─────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E2E8F4] py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left gap-4"
      >
        <span className="font-medium text-[#0F1B4C] text-sm">{q}</span>
        <span
          className={`text-[#FF6B35] text-lg transition-transform duration-200 flex-shrink-0 ${
            open ? 'rotate-45' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="text-gray-500 text-sm mt-3 leading-relaxed pr-8">{a}</p>
      )}
    </div>
  )
}

const FAQS = [
  {
    q: 'How accurate is the rank prediction?',
    a: 'Our predictor uses official 2025 JEE Advanced marks vs rank data with linear interpolation. Accuracy is typically within ±5% of the actual rank.',
  },
  {
    q: "Which year's JoSAA data is used for college matches?",
    a: '2025 JoSAA closing ranks are used. These are the most recent officially published cutoffs.',
  },
  {
    q: 'Does this work for all categories?',
    a: 'Yes — GEN, OBC-NCL, EWS, SC, and ST categories all have dedicated rank data. PwD predictions are not supported yet.',
  },
  {
    q: 'What is the full college list feature?',
    a: 'The free predictor shows your top 10 matches. The full list includes 200+ colleges with personalized choice filling order — unlocked by entering your WhatsApp number.',
  },
  {
    q: 'Is this affiliated with JEE Advanced or JoSAA?',
    a: 'No. JEEPredict is an independent tool. Always refer to the official JoSAA website for final cutoffs and admission decisions.',
  },
]

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  const [formInput, setFormInput] = useState<{
    totalMarks: number
    category: string
    gender: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    displayRank: number
    confidenceNote: string
  } | null>(null)
  const [colleges, setColleges] = useState<CollegeMatch[] | null>(null)
  const [showModal, setShowModal] = useState(false)

  const resultRef = useRef<HTMLDivElement>(null)

  async function handlePredict(input: {
    totalMarks: number
    category: string
    gender: string
  }) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setColleges(null)
    setFormInput(input)

    try {
      const rankRes = await fetch('/api/predict-rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalMarks: input.totalMarks,
          category: input.category,
          gender: input.gender,
        }),
      })

      const rankData = await rankRes.json()

      if (!rankRes.ok) {
        setError(rankData.error ?? 'Failed to predict rank. Please try again.')
        return
      }

      if (!rankData.qualified) {
        setError(
          rankData.message ??
            'Your score appears to be below the qualifying cutoff for your category.'
        )
        return
      }

      setResult({
        displayRank: rankData.displayRank,
        confidenceNote: rankData.confidenceNote,
      })

      // Scroll to results after state settles
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)

      // Non-blocking college fetch
      fetch('/api/college-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marks: input.totalMarks,
          category: input.category,
          gender: input.gender,
          limit: 10,
        }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.results) setColleges(data.results)
        })
        .catch(() => {
          // Silent fail — rank result still shown
        })
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const webAppSchema = {
    "@context":          "https://schema.org",
    "@type":             "WebApplication",
    "name":              "JEEPredict 2026 — JEE Advanced Rank Predictor",
    "url":               "https://jeepredict.in",
    "description":       "Free JEE Advanced 2026 rank predictor. Enter your marks and get your predicted rank and top IIT college matches based on 2025 JoSAA cutoff data.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem":   "Web Browser",
    "browserRequirements": "Requires JavaScript",
    "inLanguage":        "en-IN",
    "isAccessibleForFree": true,
    "offers": {
      "@type":    "Offer",
      "price":    "0",
      "priceCurrency": "INR"
    },
    "audience": {
      "@type":        "EducationalAudience",
      "educationalRole": "student"
    },
    "provider": {
      "@type": "Organization",
      "name":  "JEEPredict",
      "url":   "https://jeepredict.in"
    },
    "featureList": [
      "JEE Advanced rank prediction from marks",
      "IIT college match based on rank",
      "Category-wise rank prediction (GEN, OBC-NCL, EWS, SC, ST)",
      "Based on 2025 JoSAA closing ranks",
      "Dream, Realistic and Safe college buckets",
      "Free personalized choice filling PDF"
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    "mainEntity": [
      {
        "@type":          "Question",
        "name":           "How accurate is the JEE Advanced rank prediction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "JEEPredict uses official 2025 JEE Advanced marks vs rank data with linear interpolation. The predicted rank is typically accurate within ±5% of the actual rank."
        }
      },
      {
        "@type":          "Question",
        "name":           "Which year's JoSAA data is used for college matches?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "College matches are based on 2025 JoSAA closing ranks — the most recent officially published cutoff data."
        }
      },
      {
        "@type":          "Question",
        "name":           "Does JEEPredict work for all categories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "Yes. JEEPredict supports all major categories: GEN, OBC-NCL, EWS, SC, and ST. Each has dedicated rank data from JEE Advanced 2025."
        }
      },
      {
        "@type":          "Question",
        "name":           "What is included in the full college list?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "The free predictor shows your top 10 college matches. The full list includes 200+ colleges sorted by your rank with a personalized JoSAA choice filling PDF — unlocked free by entering your WhatsApp number."
        }
      },
      {
        "@type":          "Question",
        "name":           "Is JEEPredict affiliated with JEE Advanced or JoSAA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":  "No. JEEPredict is an independent free tool. Always refer to the official JoSAA website (josaa.nic.in) for final cutoffs and admission decisions."
        }
      }
    ]
  }

  return (
    <>
      <Navbar />

      {/* ── SECTION 1: HERO ───────────────────────────────── */}
      <section className="bg-[#0F1B4C] py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-[#FF6B35]/30">
            🎓 JEE Advanced 2026 — Results Season
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            Know Your{' '}
            <span className="relative inline-block mx-2">
              <span className="relative z-10 text-white">IIT Rank</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FF6B35] rounded-full" />
            </span>
            <br />
            Before Results Day
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-8">
            Enter your marks and instantly get your predicted rank + top IIT college
            matches. Free. No login. No BS.
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {['✓ Based on 2025 JoSAA Data', '✓ 10,500+ College Seats', '✓ 100% Free'].map(
              badge => (
                <span key={badge} className="text-white/80 text-sm flex items-center gap-1">
                  {badge}
                </span>
              )
            )}
          </div>

          <div className="mt-10 animate-bounce text-white/30 text-2xl">↓</div>
        </div>
      </section>

      {/* ── SECTION 2: PREDICTOR ─────────────────────────── */}
      <section id="predictor" className="bg-[#F5F7FF] py-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#FF6B35] font-semibold text-xs tracking-widest uppercase mb-2">
            Free Rank Predictor
          </p>
          <h2 className="text-2xl font-bold text-[#0F1B4C] mb-6">Enter Your Details</h2>

          <PredictorForm onSubmit={handlePredict} isLoading={isLoading} />

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <span className="text-red-500 text-lg mt-0.5">⚠️</span>
              <div>
                <p className="text-red-700 font-semibold text-sm">Something went wrong</p>
                <p className="text-red-500 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Loading skeleton for colleges (shows while rank is loading) */}
          {isLoading && (
            <div className="mt-8 space-y-3 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl" />
              ))}
            </div>
          )}

          {/* Results */}
          {result && (
            <div ref={resultRef} className="mt-8">
              <RankResult
                displayRank={result.displayRank}
                confidenceNote={result.confidenceNote}
                category={formInput!.category}
                gender={formInput!.gender}
                colleges={colleges ?? []}
                onUnlockClick={() => setShowModal(true)}
                marks={formInput!.totalMarks}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ──────────────────────── */}
      <section id="how-it-works" className="bg-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#FF6B35] text-xs font-semibold tracking-widest uppercase mb-2">
              Simple Process
            </p>
            <h2 className="text-3xl font-bold text-[#0F1B4C]">How JEEPredict Works</h2>
            <p className="text-gray-400 text-sm mt-2">
              Get your rank and college list in under 10 seconds
            </p>
          </div>

          <div className="relative flex flex-col md:flex-row gap-8 md:gap-4">
            {/* Dashed connector — desktop only */}
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px border-t-2 border-dashed border-[#E2E8F4] z-0" />

            {[
              {
                step: '1',
                icon: '✏️',
                title: 'Enter Your Marks',
                body: 'Input your JEE Advanced 2026 total marks, select your category and gender.',
              },
              {
                step: '2',
                icon: '⚡',
                title: 'Instant Rank Prediction',
                body: 'Our algorithm uses official 2025 data and linear interpolation for high accuracy.',
              },
              {
                step: '3',
                icon: '🎓',
                title: 'See Your Colleges',
                body: 'Get dream, realistic, and safe matches across IITs.',
              },
            ].map(item => (
              <div
                key={item.step}
                className="relative z-10 flex-1 flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#E2E8F4] shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-[#FF6B35] text-white text-2xl font-black flex items-center justify-center mb-4 shadow-lg shadow-[#FF6B35]/30">
                  {item.icon}
                </div>
                <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#0F1B4C] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.step}
                </span>
                <h3 className="font-bold text-[#0F1B4C] text-base mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: SOCIAL PROOF ──────────────────────── */}
      <section className="bg-[#F5F7FF] py-10 px-4 border-y border-[#E2E8F4]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { number: '50,000+', label: 'Students Predicted' },
              { number: '23', label: 'IITs Covered' },
              { number: '2025', label: 'JoSAA Data Year' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-[#0F1B4C]">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FAQ ────────────────────────────────── */}
      <section className="bg-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#0F1B4C]">Common Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-[#0F1B4C] py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/logo.png"
              height={32}
              width={100}
              alt="JEEPredict"
              className="object-contain opacity-80"
            />
            <span className="text-white font-bold">JEEPredict 2026</span>
          </div>
          <p className="text-white/40 text-xs">
            Free JEE Advanced 2026 Rank Predictor · Not affiliated with JEE Advanced or JoSAA
          </p>
          <p className="text-white/20 text-xs mt-1">
            Predictions are based on 2025 JoSAA data and are indicative only. Always verify with
            official sources.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-white/40 text-xs">
            <span>© 2026 JEEPredict</span>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL (Screen 2) ────────────────────────── */}
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
        prefillData={result && formInput ? {
          marks: formInput.totalMarks,
          category: formInput.category,
          gender: formInput.gender,
          predicted_rank: result.displayRank,
        } : undefined}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
