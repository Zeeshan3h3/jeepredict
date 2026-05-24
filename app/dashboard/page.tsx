/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from 'react'
import DashboardNav from '@/components/DashboardNav'
import FullCollegeList from '@/components/FullCollegeList'
import CollegeFilters from '@/components/CollegeFilters'
import StudentProfileForm from '@/components/StudentProfileForm'
import { useStudent } from '@/hooks/useStudent'
import { CollegeMatch } from '@/types/database'
import type { FiltersState } from '@/components/FullCollegeList'

type Tab = 'colleges' | 'profile' | 'guidance'

const DEFAULT_FILTERS: FiltersState = {
  instituteType: 'all',
  quota: 'AI',
  showDream: true,
  showRealistic: true,
  showSafe: true,
  searchQuery: '',
  round: 1,
}

/* ── Stat card data ────────────────────────────────────────── */
type StatCard = {
  label: string
  value: number | string
  emoji: string
  color: string
  bgColor: string
}

export default function DashboardPage() {
  const { student, loading: studentLoading, refetch } = useStudent()
  const [activeTab, setActiveTab] = useState<Tab>('colleges')
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS)
  const [colleges, setColleges] = useState<CollegeMatch[]>([])
  const [collegesLoading, setCollegesLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  /* fetch college list whenever student data or round changes */
  useEffect(() => {
    if (!student?.marks || !student?.category || !student?.gender) return
    setCollegesLoading(true)
    fetch('/api/college-matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marks: student.marks,
        category: student.category,
        gender: student.gender,
        limit: 300,
        round: filters.round,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setColleges(data.results ?? [])
        setCollegesLoading(false)
      })
      .catch(() => setCollegesLoading(false))
  }, [student, filters.round])

  /* ── Skeleton / loading ── */
  if (studentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const hasPrediction = !!(student?.marks && student?.category && student?.gender)

  const statCards: StatCard[] = [
    {
      label: 'Total Matches',
      value: collegesLoading ? '—' : colleges.length,
      emoji: '🏛️',
      color: '#0F1B4C',
      bgColor: '#EEF2FF',
    },
    {
      label: 'Dream Colleges',
      value: collegesLoading ? '—' : colleges.filter(c => c.tier === 'dream').length,
      emoji: '🌟',
      color: '#7C3AED',
      bgColor: '#F3E8FF',
    },
    {
      label: 'Realistic Choices',
      value: collegesLoading ? '—' : colleges.filter(c => c.tier === 'realistic').length,
      emoji: '🎯',
      color: '#D97706',
      bgColor: '#FEF3C7',
    },
    {
      label: 'Safe Admits',
      value: collegesLoading ? '—' : colleges.filter(c => c.tier === 'safe').length,
      emoji: '✅',
      color: '#059669',
      bgColor: '#D1FAE5',
    },
  ]

  return (
    <>
      <DashboardNav student={student} />

      <main className="bg-[#F5F7FF] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

          {/* ── Welcome Banner ──────────────────────────────── */}
          <div className="bg-[#0F1B4C] rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
            {/* decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-white/60 text-sm">Welcome back,</p>
                <h1 className="text-white text-2xl md:text-3xl font-black mt-1">
                  {student?.name ?? 'Student'} 👋
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {hasPrediction
                    ? "Here's your personalized JoSAA roadmap"
                    : 'Complete your profile to see college matches'}
                </p>

                {/* Go-to-profile nudge if no prediction data */}
                {!hasPrediction && (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="mt-3 bg-[#FF6B35] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
                  >
                    Complete Profile →
                  </button>
                )}
              </div>

              {student?.predicted_rank ? (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center min-w-[150px] flex-shrink-0">
                  <p className="text-white/60 text-xs">Your Predicted Rank</p>
                  <p className="text-white text-4xl font-black mt-1 leading-none">
                    {student.predicted_rank.toLocaleString('en-IN')}
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {student.category && (
                      <span className="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-full">
                        {student.category}
                      </span>
                    )}
                    {student.marks && (
                      <span className="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-full">
                        {student.marks}/360 marks
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* ── Stat Cards ──────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {statCards.map(card => (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-4 border border-[#E2E8F4] shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3"
                  style={{ backgroundColor: card.bgColor }}
                >
                  {card.emoji}
                </div>
                <p
                  className="font-black text-2xl leading-none"
                  style={{ color: card.color }}
                >
                  {card.value}
                </p>
                <p className="text-gray-400 text-xs mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* ── Round data note ─────────────────────────────── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-6 flex items-center gap-2">
            <span className="text-blue-600 text-sm">ℹ️</span>
            <p className="text-blue-700 text-xs">
              <span className="font-semibold">JoSAA 2025 Round {filters.round} Cutoffs:</span>{' '}
              {filters.round === 1 ? (
                <span>Round 1 cutoffs are the strictest. Ranks generally slide down in subsequent rounds (Rounds 2–6), increasing your admission chances.</span>
              ) : (
                <span>Viewing Round {filters.round} cutoffs. Ranks have expanded from Round 1, showing more realistic final options.</span>
              )}
            </p>
          </div>

          {/* ── Tab Navigation ──────────────────────────────── */}
          <div className="overflow-x-auto mb-6 -mx-1 px-1">
            <div className="flex gap-1 bg-white rounded-2xl p-1 border border-[#E2E8F4] shadow-sm w-fit min-w-full sm:min-w-0">
              {(
                [
                  { id: 'colleges', label: '🏛️ My Colleges' },
                  { id: 'profile', label: '👤 My Profile' },
                  { id: 'guidance', label: '📞 Get Guidance' },
                ] as { id: Tab; label: string }[]
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0F1B4C] text-white shadow-sm'
                      : 'text-gray-500 hover:text-[#0F1B4C] hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab: Colleges ───────────────────────────────── */}
          {activeTab === 'colleges' && (
            <>
              {!hasPrediction ? (
                /* No prediction data yet */
                <div className="bg-white rounded-2xl border border-[#E2E8F4] p-10 text-center">
                  <p className="text-5xl mb-4">🏛️</p>
                  <p className="text-[#0F1B4C] font-bold text-lg">No college matches yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Complete your profile with your marks, category, and gender to see your personalized college list.
                  </p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="mt-4 bg-[#FF6B35] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition"
                  >
                    Complete Profile →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-64 flex-shrink-0">
                    <CollegeFilters filters={filters} onChange={setFilters} colleges={colleges} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <FullCollegeList
                      colleges={colleges}
                      filters={filters}
                      loading={collegesLoading}
                      onRoundChange={r => setFilters(prev => ({ ...prev, round: r }))}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Tab: Profile ────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-lg">
              <div className="bg-white rounded-2xl border border-[#E2E8F4] shadow-sm p-6">
                <h2 className="font-bold text-[#0F1B4C] text-lg mb-1">Your Profile</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Update your details to see personalized college matches
                </p>

                {/* Phone read-only */}
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-5">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-[10px] text-gray-400">Verified WhatsApp Number</p>
                    <p className="text-sm font-semibold text-[#0F1B4C]">
                      {student?.phone
                        ? `+91 ${student.phone.replace('+91', '').replace(/^91/, '')}`
                        : '—'}
                    </p>
                  </div>
                  <span className="ml-auto bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    ✓ Verified
                  </span>
                </div>

                {student && (
                  <StudentProfileForm
                    initialData={{
                      name: student.name,
                      email: student.email,
                      marks: student.marks,
                      category: student.category,
                      gender: student.gender,
                    }}
                    onSave={async data => {
                      setIsSaving(true)
                      await fetch('/api/student/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                      })
                      await refetch()
                      setIsSaving(false)
                    }}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Tab: Guidance ───────────────────────────────── */}
          {activeTab === 'guidance' && (
            <div className="max-w-2xl space-y-4">
              {/* 1-on-1 CTA */}
              <div className="bg-[#0F1B4C] rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top right, rgba(255,107,53,0.15), transparent 70%)' }} />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF6B35] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                    🎓
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">1-on-1 Expert Counselling</h3>
                    <p className="text-white/60 text-sm mt-1 leading-relaxed">
                      Talk directly with a JEE counsellor who has helped 500+ students crack JoSAA.
                      Get your complete choice list built for your rank.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Choice filling', 'Branch analysis', 'Mock JOSAA rounds', 'Upgrade strategy'].map(tag => (
                        <span key={tag} className="bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href="https://wa.me/919999999999?text=Hi%2C+I+want+to+book+a+JEE+counselling+session."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 bg-[#FF6B35] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                    >
                      📞 Book a Free Session
                    </a>
                  </div>
                </div>
              </div>

              {/* JoSAA 2026 Key Dates */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F4] shadow-sm">
                <h3 className="font-bold text-[#0F1B4C] text-base mb-4 flex items-center gap-2">
                  📅 JoSAA 2026 Key Dates
                </h3>
                <div className="space-y-3">
                  {[
                    { date: 'June 9, 2026',  event: 'JEE Advanced Results' },
                    { date: 'June 15, 2026', event: 'JoSAA Registration Opens' },
                    { date: 'June 20, 2026', event: 'Choice Filling Deadline' },
                    { date: 'June 25, 2026', event: 'Round 1 Seat Allotment' },
                    { date: 'July 18, 2026', event: 'Final Round Allotment' },
                  ].map((item, i) => (
                    <div key={item.event} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        i === 0 ? 'bg-[#FF6B35]' : i < 2 ? 'bg-amber-400' : 'bg-[#0F1B4C]'
                      }`} />
                      <span className="text-gray-400 text-xs w-28 flex-shrink-0">{item.date}</span>
                      <span className="text-[#0F1B4C] font-medium text-xs">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Resources */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F4] shadow-sm">
                <h3 className="font-bold text-[#0F1B4C] text-base mb-4">📚 Free Resources</h3>
                <div className="space-y-2">
                  {[
                    { icon: '📄', title: 'JoSAA Choice Filling Guide 2025', desc: 'Step-by-step PDF walkthrough', href: '#' },
                    { icon: '📊', title: 'Branch Comparison Sheet', desc: 'IIT CS vs ECE vs Mech — salary & scope', href: '#' },
                    { icon: '🎯', title: 'IIT vs NIT: Which to Choose?', desc: 'Complete guide for borderline ranks', href: '#' },
                    { icon: '🗂️', title: 'Previous Year Cutoff Archive', desc: '2021–2025 round-wise data', href: '#' },
                  ].map(r => (
                    <a
                      key={r.title}
                      href={r.href}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F4] hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/5 transition group"
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0F1B4C] font-medium text-sm group-hover:text-[#FF6B35] transition">
                          {r.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">{r.desc}</p>
                      </div>
                      <span className="text-gray-300 group-hover:text-[#FF6B35] transition flex-shrink-0">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
