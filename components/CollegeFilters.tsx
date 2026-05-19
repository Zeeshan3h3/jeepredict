'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { FiltersState } from './FullCollegeList'
import { CollegeMatch } from '@/types/database'

interface CollegeFiltersProps {
  filters: FiltersState
  onChange: (f: FiltersState) => void
  colleges?: CollegeMatch[]
}

const DEFAULT_FILTERS: FiltersState = {
  instituteType: 'all',
  quota: 'AI',
  showDream: true,
  showRealistic: true,
  showSafe: true,
  searchQuery: '',
}

const INST_TYPES = ['all', 'IIT', 'NIT', 'IIIT', 'GFTI'] as const

export default function CollegeFilters({ filters, onChange, colleges = [] }: CollegeFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const dreamCount = colleges.filter(c => c.tier === 'dream').length
  const realisticCount = colleges.filter(c => c.tier === 'realistic').length
  const safeCount = colleges.filter(c => c.tier === 'safe').length

  const panel = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#0F1B4C] text-sm">Filters</span>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-[#FF6B35] text-xs cursor-pointer hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
        <input
          type="text"
          placeholder="Search college or branch..."
          value={filters.searchQuery}
          onChange={e => onChange({ ...filters, searchQuery: e.target.value })}
          className="w-full border border-[#E2E8F4] rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
        />
      </div>

      {/* Institute type */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Institute Type</label>
        <div className="flex flex-wrap gap-1.5">
          {INST_TYPES.map(t => (
            <button
              key={t}
              onClick={() => onChange({ ...filters, instituteType: t })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                filters.instituteType === t
                  ? 'bg-[#0F1B4C] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Quota */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Quota</label>
        <select
          value={filters.quota}
          onChange={e => onChange({ ...filters, quota: e.target.value })}
          className="w-full border border-[#E2E8F4] rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition bg-white appearance-none cursor-pointer"
        >
          <option value="all">All Quotas</option>
          <option value="AI">AI – All India</option>
          <option value="HS">HS – Home State</option>
          <option value="OS">OS – Other State</option>
        </select>
      </div>

      {/* Tier checkboxes */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">College Tier</label>
        <div className="space-y-2">
          <label className="flex items-center justify-between py-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showDream}
                onChange={e => onChange({ ...filters, showDream: e.target.checked })}
                className="accent-purple-600 w-4 h-4"
              />
              <span className="text-purple-700 text-sm">Dream Colleges</span>
            </div>
            <span className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
              {dreamCount}
            </span>
          </label>

          <label className="flex items-center justify-between py-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showRealistic}
                onChange={e => onChange({ ...filters, showRealistic: e.target.checked })}
                className="accent-amber-600 w-4 h-4"
              />
              <span className="text-amber-700 text-sm">Realistic Matches</span>
            </div>
            <span className="bg-amber-50 text-amber-600 text-xs px-2 py-0.5 rounded-full">
              {realisticCount}
            </span>
          </label>

          <label className="flex items-center justify-between py-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showSafe}
                onChange={e => onChange({ ...filters, showSafe: e.target.checked })}
                className="accent-green-600 w-4 h-4"
              />
              <span className="text-green-700 text-sm">Safe Admits</span>
            </div>
            <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
              {safeCount}
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:block sticky top-24 bg-white rounded-2xl border border-[#E2E8F4] shadow-sm p-5">
        {panel}
      </div>

      {/* Mobile collapsible */}
      <div className="lg:hidden bg-white rounded-2xl border border-[#E2E8F4] shadow-sm p-4 mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-[#0F1B4C]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={14} />
            Filters
          </span>
          <span className="text-gray-400 text-xs">{mobileOpen ? '▲' : '▼'}</span>
        </button>
        {mobileOpen && <div className="mt-4">{panel}</div>}
      </div>
    </>
  )
}
