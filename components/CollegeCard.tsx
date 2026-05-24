'use client'

import { CollegeMatch, Tier } from '@/types/database'

interface CollegeCardProps {
  college: CollegeMatch
  rank: number
}

const tierStyles: Record<Tier, { circle: string; text: string }> = {
  dream:     { circle: 'bg-purple-100', text: 'text-purple-700' },
  realistic: { circle: 'bg-amber-100',  text: 'text-amber-700'  },
  safe:      { circle: 'bg-green-100',  text: 'text-green-700'  },
}

export default function CollegeCard({ college, rank }: CollegeCardProps) {
  const style = tierStyles[college.tier] ?? tierStyles.safe
  const quotaLabel = college.quota === 'AI' ? 'All India' : college.quota

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E2E8F4] p-4 hover:shadow-md hover:border-[#FF6B35]/30 transition-all duration-200 cursor-pointer">
      {/* Rank circle */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${style.circle} ${style.text}`}
      >
        #{rank}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#0F1B4C] text-sm truncate">
          {college.institute}
        </p>
        <p className="text-gray-500 text-xs mt-0.5 truncate">{college.program}</p>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
            {quotaLabel}
          </span>
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
            {college.category}
          </span>
          {college.gender_pool === 'Female-Only' && (
            <span className="bg-pink-50 text-pink-600 text-[10px] px-2 py-0.5 rounded-full">
              Female-Only
            </span>
          )}
        </div>
      </div>

      {/* Rank info */}
      <div className="flex-shrink-0 text-right">
        <p className="text-gray-400 text-[10px]">R6 Closing Rank</p>
        <p className="font-bold text-[#0F1B4C] text-sm">
          {(college.r6_closing ?? college.closing_rank).toLocaleString('en-IN')}
        </p>
        <p className="text-gray-400 text-[10px] mt-0.5">
          R1 Opening: {(college.r1_opening ?? college.opening_rank).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}
