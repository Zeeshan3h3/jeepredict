'use client'

import { useState, useEffect } from 'react'
import { Download, SearchX } from 'lucide-react'
import CollegeCard from './CollegeCard'
import { CollegeMatch, Tier } from '@/types/database'

export interface FiltersState {
  instituteType: 'all' | 'IIT' | 'NIT' | 'IIIT' | 'GFTI'
  quota: string
  showDream: boolean
  showRealistic: boolean
  showSafe: boolean
  searchQuery: string
}

interface FullCollegeListProps {
  colleges: CollegeMatch[]
  filters: FiltersState
  loading: boolean
}

const PAGE_SIZE = 20

const tierBadge: Record<Tier, string> = {
  dream:     'bg-purple-50 text-purple-700',
  realistic: 'bg-amber-50 text-amber-700',
  safe:      'bg-green-50 text-green-700',
}

const tierLabel: Record<Tier, string> = {
  dream:     'Dream',
  realistic: 'Realistic',
  safe:      'Safe',
}

export default function FullCollegeList({ colleges, filters, loading }: FullCollegeListProps) {
  const [page, setPage] = useState(1)

  const filtered = colleges.filter(c => {
    if (filters.instituteType !== 'all') {
      if (!c.institute.toLowerCase().includes(filters.instituteType.toLowerCase())) return false
    }
    if (filters.quota !== 'all' && filters.quota !== '' && c.quota !== filters.quota) return false
    if (!filters.showDream && c.tier === 'dream') return false
    if (!filters.showRealistic && c.tier === 'realistic') return false
    if (!filters.showSafe && c.tier === 'safe') return false
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      return (
        c.institute.toLowerCase().includes(q) || c.program.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400 text-sm">{filtered.length} colleges found</p>
        <button
          onClick={() => alert('PDF export coming soon!')}
          className="border border-[#E2E8F4] text-gray-400 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-gray-50 transition"
        >
          <Download size={12} />
          Export PDF
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F4] p-10 text-center">
          <SearchX size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-[#0F1B4C] font-medium text-sm">No colleges match your filters.</p>
          <p className="text-gray-400 text-xs mt-1">Try clearing some filters.</p>
        </div>
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-2xl border border-[#E2E8F4] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E2E8F4]">
                  <th className="text-gray-400 text-xs font-medium px-4 py-3 w-10">#</th>
                  <th className="text-gray-400 text-xs font-medium px-4 py-3">Institute</th>
                  <th className="text-gray-400 text-xs font-medium px-4 py-3">Program</th>
                  <th className="text-gray-400 text-xs font-medium px-4 py-3">Quota</th>
                  <th className="text-gray-400 text-xs font-medium px-4 py-3 text-right">Opening</th>
                  <th className="text-gray-400 text-xs font-medium px-4 py-3 text-right">Closing</th>
                  <th className="text-gray-400 text-xs font-medium px-4 py-3">Tier</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#E2E8F4] last:border-0 hover:bg-[#F5F7FF] transition"
                  >
                    <td className="text-gray-400 text-xs px-4 py-3">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="font-semibold text-[#0F1B4C] text-sm px-4 py-3 max-w-[200px]">
                      <p className="truncate">{c.institute}</p>
                    </td>
                    <td className="text-gray-500 text-xs px-4 py-3 max-w-[180px]">
                      <p className="truncate">{c.program}</p>
                    </td>
                    <td className="text-gray-400 text-xs px-4 py-3">
                      {c.quota === 'AI' ? 'All India' : c.quota}
                    </td>
                    <td className="text-gray-400 text-xs px-4 py-3 text-right">
                      {c.opening_rank.toLocaleString('en-IN')}
                    </td>
                    <td className="font-bold text-[#0F1B4C] text-sm px-4 py-3 text-right">
                      {c.closing_rank.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierBadge[c.tier]}`}
                      >
                        {tierLabel[c.tier]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paginated.map((c, idx) => (
              <CollegeCard key={c.id} college={c} rank={(page - 1) * PAGE_SIZE + idx + 1} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border border-[#E2E8F4] px-3 py-1.5 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                ← Prev
              </button>
              <span className="text-gray-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border border-[#E2E8F4] px-3 py-1.5 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
