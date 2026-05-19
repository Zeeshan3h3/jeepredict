'use client'

import { CollegeMatch } from '@/types/database'
import CollegeCard from './CollegeCard'
import { SearchX, FileText } from 'lucide-react'

interface RankResultProps {
  displayRank: number
  confidenceNote: string
  category: string
  gender: string
  colleges: CollegeMatch[]
  onUnlockClick: () => void
}

const tierConfig = {
  dream: {
    label: 'Dream Colleges',
    dotClass: 'bg-purple-500',
    labelClass: 'text-purple-700',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-600',
  },
  realistic: {
    label: 'Realistic Matches',
    dotClass: 'bg-amber-500',
    labelClass: 'text-amber-700',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-600',
  },
  safe: {
    label: 'Safe Admits',
    dotClass: 'bg-green-500',
    labelClass: 'text-green-700',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-600',
  },
} as const

export default function RankResult({
  displayRank,
  confidenceNote,
  category,
  gender,
  colleges,
  onUnlockClick,
}: RankResultProps) {
  const dream = colleges.filter(c => c.tier === 'dream')
  const realistic = colleges.filter(c => c.tier === 'realistic')
  const safe = colleges.filter(c => c.tier === 'safe')

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
            🎉 Your Predicted Rank
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-bold text-[#0F1B4C] text-xl">Your College Matches</h2>
            <p className="text-gray-400 text-xs">Top 10 matches · 2025 JoSAA closing ranks</p>
          </div>
          {colleges.length > 0 && (
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
              {colleges.length} matches found
            </span>
          )}
        </div>

        {/* Empty state */}
        {colleges.length === 0 && (
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

        {/* Tier sections */}
        {(['dream', 'realistic', 'safe'] as const).map(tier => {
          const tierColleges = tier === 'dream' ? dream : tier === 'realistic' ? realistic : safe
          if (tierColleges.length === 0) return null
          const cfg = tierConfig[tier]
          return (
            <div key={tier}>
              <div className="flex justify-between items-center mb-3 mt-6">
                <span className={`flex items-center gap-2 font-semibold text-sm ${cfg.labelClass}`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${cfg.dotClass}`} />
                  {cfg.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badgeBg} ${cfg.badgeText}`}>
                  {tierColleges.length} college{tierColleges.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {tierColleges.map((college, idx) => (
                  <CollegeCard key={college.id} college={college} rank={idx + 1} />
                ))}
              </div>
            </div>
          )
        })}
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
    </div>
  )
}
