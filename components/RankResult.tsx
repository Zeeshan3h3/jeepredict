/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { CollegeMatch } from '@/types/database'
import CollegeCard from './CollegeCard'
import { SearchX, FileText, ChevronDown, ChevronUp } from 'lucide-react'

interface RankResultProps {
  displayRank: number
  confidenceNote: string
  category: string
  gender: string
  colleges: CollegeMatch[]
  onUnlockClick: () => void
  marks?: number
}


export default function RankResult({
  displayRank,
  confidenceNote,
  category,
  gender,
  colleges,
  onUnlockClick,
  marks,
}: RankResultProps) {
  const [currentRound, setCurrentRound] = useState<number>(1)
  const [collegesList, setCollegesList] = useState<CollegeMatch[]>(colleges)
  const [loading, setLoading] = useState(false)

  // Per-tier expansion state
  const [showAllDream, setShowAllDream] = useState(false)
  const [showAllRealistic, setShowAllRealistic] = useState(false)
  const [showAllSafe, setShowAllSafe] = useState(false)

  // Refs for scroll behavior
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
    dream: null,
    realistic: null,
    safe: null,
  })

  // Reset expansion when colleges change (new prediction)
  const resetExpansion = useCallback(() => {
    setShowAllDream(false)
    setShowAllRealistic(false)
    setShowAllSafe(false)
  }, [])

  // Sync prop changes (e.g. from new prediction inputs)
  useEffect(() => {
    setCollegesList(colleges)
    setCurrentRound(1)
    resetExpansion()
  }, [colleges, resetExpansion])

  // Fetch updated cutoffs when changing rounds
  useEffect(() => {
    if (currentRound === 1) {
      setCollegesList(colleges)
      resetExpansion()
      return
    }
    if (marks === undefined) return

    setLoading(true)
    resetExpansion()
    fetch('/api/college-matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marks,
        category,
        gender,
        limit: 10,
        round: currentRound,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setCollegesList(data.results ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [currentRound, colleges, marks, category, gender, resetExpansion])

  const dream = collegesList.filter(c => c.tier === 'dream')
  const realistic = collegesList.filter(c => c.tier === 'realistic')
  const safe = collegesList.filter(c => c.tier === 'safe')


  // NOTE: scroll logic is inlined in onClick handlers below
  // to satisfy react-hooks/refs lint rule (refs must only be
  // accessed in event handlers, not in closures)

  const genderLabel = gender === 'gender-neutral' ? 'Gender Neutral' : 'Female'

  return (
    <div>
      {/* ── Part A: Rank Hero Card ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rank-animate { animation: fadeInUp 0.5s ease-out both; }
        @keyframes expandCardIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .expand-card { animation: expandCardIn 0.25s ease-out both; }
      `}</style>

      <div className="relative bg-[#0F1B4C] rounded-2xl p-8 md:p-12 overflow-hidden">
        {/* Radial gradient depth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(255,107,53,0.13) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center rank-animate">
          {/* Badge */}
          <span className="inline-block bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full mb-4">
            🎉 Predicted JEE Advanced {category === 'GEN' ? 'AIR' : `${category} Rank`}
          </span>

          {/* Rank number */}
          <div
            className="text-6xl md:text-8xl font-black text-white leading-none"
            style={{ textShadow: '0 0 40px rgba(255,107,53,0.25)' }}
          >
            {displayRank.toLocaleString('en-IN')}
          </div>

          {/* Confidence note */}
          <p className="text-white/50 text-xs italic mt-2">{confidenceNote}</p>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              `Category: ${category}`,
              `Gender: ${genderLabel}`,
              'Based on 2025 Data',
            ].map(pill => (
              <span
                key={pill}
                className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full border border-white/20"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mt-6 mb-6" />

          {/* Quick stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { val: '10,500+', sub: 'College Seats' },
              { val: '23', sub: 'IITs Covered' },
              { val: '2025', sub: 'JoSAA Data' },
            ].map(s => (
              <div key={s.sub} className="text-center">
                <div className="text-white font-bold text-xl">{s.val}</div>
                <div className="text-white/50 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Part B: College Matches ── */}
      <div className="mt-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="font-bold text-[#0F1B4C] text-xl">Your College Matches</h2>
            <p className="text-gray-400 text-xs">All matches · 2025 JoSAA closing ranks</p>
          </div>
          
          {/* Round Selector Pill bar */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            {[1, 2, 3, 4, 5, 6].map(r => (
              <button
                key={r}
                disabled={loading}
                onClick={() => setCurrentRound(r)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentRound === r
                    ? 'bg-[#0F1B4C] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#0F1B4C] hover:bg-gray-200'
                }`}
              >
                Round {r}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Round Disclaimer */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 mb-6 text-xs text-blue-700 leading-relaxed shadow-sm">
          <span className="font-semibold block mb-1">💡 JoSAA 2025 Round {currentRound} Cutoff Insights</span>
          {currentRound === 1 ? (
            "Round 1 ranks are the most competitive. If a college is listed in 'Dream' or 'Realistic', your actual chances are higher because closing ranks generally expand in later rounds (Rounds 2–6)."
          ) : (
            `Currently viewing Round ${currentRound} cutoffs. Ranks slide downwards in later rounds, and Round 6 represents the final seat allotment thresholds.`
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && collegesList.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F4] p-10 text-center">
            <SearchX className="mx-auto mb-3 text-gray-300" size={36} />
            <p className="text-[#0F1B4C] font-medium text-sm">
              No college matches found for this rank range.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Try adjusting your category or check back with updated data.
            </p>
          </div>
        )}

        {/* ── Tier: Dream Colleges ── */}
        {!loading && dream.length > 0 && (
          <div ref={el => { sectionRefs.current.dream = el }} className="scroll-mt-4">
            <div className="flex justify-between items-center mb-3 mt-6">
              <span className="flex items-center gap-2 font-semibold text-sm text-purple-700">
                <span className="w-2 h-2 rounded-full inline-block bg-purple-500" />
                Dream Colleges
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-600">
                {dream.length} college{dream.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2">
              {(showAllDream ? dream : dream.slice(0, 3)).map((college, idx) => (
                <div
                  key={college.id}
                  className={idx >= 3 ? 'expand-card' : ''}
                  style={idx >= 3 ? { animationDelay: `${(idx - 3) * 0.04}s` } : undefined}
                >
                  <CollegeCard college={college} rank={idx + 1} />
                </div>
              ))}
            </div>

            {dream.length > 3 && (
              <div className="flex justify-center mt-3 mb-2">
                <button
                  onClick={() => setShowAllDream(!showAllDream)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer border-purple-200 hover:border-purple-400 text-purple-600 hover:bg-purple-50 bg-white"
                >
                  {showAllDream ? "Show Less" : `Show all ${dream.length} colleges`}
                  {showAllDream ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tier: Realistic Matches ── */}
        {!loading && realistic.length > 0 && (
          <div ref={el => { sectionRefs.current.realistic = el }} className="scroll-mt-4">
            <div className="flex justify-between items-center mb-3 mt-6">
              <span className="flex items-center gap-2 font-semibold text-sm text-amber-700">
                <span className="w-2 h-2 rounded-full inline-block bg-amber-500" />
                Realistic Matches
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600">
                {realistic.length} college{realistic.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2">
              {(showAllRealistic ? realistic : realistic.slice(0, 3)).map((college, idx) => (
                <div
                  key={college.id}
                  className={idx >= 3 ? 'expand-card' : ''}
                  style={idx >= 3 ? { animationDelay: `${(idx - 3) * 0.04}s` } : undefined}
                >
                  <CollegeCard college={college} rank={idx + 1} />
                </div>
              ))}
            </div>

            {realistic.length > 3 && (
              <div className="flex justify-center mt-3 mb-2">
                <button
                  onClick={() => setShowAllRealistic(!showAllRealistic)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer border-amber-200 hover:border-amber-400 text-amber-600 hover:bg-amber-50 bg-white"
                >
                  {showAllRealistic ? "Show Less" : `Show all ${realistic.length} colleges`}
                  {showAllRealistic ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tier: Safe Admits ── */}
        {!loading && safe.length > 0 && (
          <div ref={el => { sectionRefs.current.safe = el }} className="scroll-mt-4">
            <div className="flex justify-between items-center mb-3 mt-6">
              <span className="flex items-center gap-2 font-semibold text-sm text-green-700">
                <span className="w-2 h-2 rounded-full inline-block bg-green-500" />
                Safe Admits
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">
                {safe.length} college{safe.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2">
              {(showAllSafe ? safe : safe.slice(0, 3)).map((college, idx) => (
                <div
                  key={college.id}
                  className={idx >= 3 ? 'expand-card' : ''}
                  style={idx >= 3 ? { animationDelay: `${(idx - 3) * 0.04}s` } : undefined}
                >
                  <CollegeCard college={college} rank={idx + 1} />
                </div>
              ))}
            </div>

            {safe.length > 3 && (
              <div className="flex justify-center mt-3 mb-2">
                <button
                  onClick={() => setShowAllSafe(!showAllSafe)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer border-green-200 hover:border-green-400 text-green-600 hover:bg-green-50 bg-white"
                >
                  {showAllSafe ? "Show Less" : `Show all ${safe.length} colleges`}
                  {showAllSafe ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Part C: Unlock CTA Banner ── */}
      <div
        className="mt-8 rounded-2xl p-6 md:p-8 border border-white/10"
        style={{ background: 'linear-gradient(to right, #0F1B4C, #1a3a7c)' }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <FileText size={24} className="text-[#FF6B35] mb-2 md:hidden" />
            <h3 className="text-white font-bold text-lg">
              Want the full list of 200+ colleges?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Get your personalized JoSAA choice filling PDF + all colleges sorted by your rank — completely free.
            </p>
            <p className="text-white/40 text-xs mt-2">✓ Instant &nbsp; ✓ Free &nbsp; ✓ No spam</p>
          </div>
          <button
            onClick={onUnlockClick}
            className="bg-[#FF6B35] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all whitespace-nowrap md:ml-6 flex-shrink-0"
          >
            Get Full List &amp; PDF  →
          </button>
        </div>
      </div>

      {/* ── Part D: Placeholder for Mains ── */}
      <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
        <h3 className="text-gray-600 font-semibold text-sm">
          NIT & IIIT predictor based on JEE Mains rank — Coming Soon
        </h3>
      </div>
    </div>
  )
}
