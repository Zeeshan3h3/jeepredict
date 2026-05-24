import { NextResponse } from 'next/server'
import { getRankRange } from '@/lib/rank-lookup'
import { Category } from '@/types/database'
import { josaaData, RoundNumber } from '@/data/josaa/iit'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marks, category, gender, limit = 10, round = 1 } = body

    // Basic validation
    if (typeof marks !== 'number' || marks < 0 || marks > 360) {
      return NextResponse.json({ error: 'Invalid marks' }, { status: 400 })
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const rankResult = getRankRange(marks, category as Category)

    if (!rankResult) {
      return NextResponse.json({ total: 0, results: [], message: 'Below cutoff' })
    }

    const { best, predicted, worst } = rankResult._internal

    // Gender pools
    const genderPools = ['Gender-Neutral']
    const genderStr = (gender ?? '').toLowerCase()
    if (genderStr === 'female' || genderStr === 'female-only') {
      genderPools.push('Female-Only')
    }

    // Query range:
    // Dream:    closing_rank < predicted  (college cutoff below our rank = harder to get)
    // Realistic: closing_rank ~ predicted ± range
    // Safe:     closing_rank > worst      (college cutoff above our worst = guaranteed)
    const lowerBound = Math.max(1, Math.round(best * 0.5))
    const upperBound = Math.round(worst * 2.0)

    // Load data from JSON based on round
    const roundNum = (Number(round) || 1) as RoundNumber
    const allRecords = josaaData[roundNum] || []

    const filteredColleges = allRecords.filter(row => {
      // Filter by category
      if (row.category !== category) return false
      // Filter by gender pool
      if (!genderPools.includes(row.gender_pool)) return false
      // Filter by closing rank range
      if (row.closing_rank < lowerBound || row.closing_rank > upperBound) return false
      return true
    })

    // Map to the required database shape for frontend compatibility
    const colleges = filteredColleges.map((row, idx) => ({
      id: `${roundNum}-${idx}`,
      institute: row.institute,
      program: row.program,
      quota: row.quota,
      category: row.category,
      gender_pool: row.gender_pool,
      opening_rank: row.opening_rank,
      closing_rank: row.closing_rank,
      year: 2025,
      round: roundNum,
    }))

    // Sort by closing_rank ascending
    colleges.sort((a, b) => a.closing_rank - b.closing_rank)

    const isFullList = limit > 10  // dashboard mode vs free preview mode

    // ── Cross-round enrichment: R1 opening + R6 closing ───────────
    // Build lookup maps keyed by "institute|program|category|gender_pool"
    const makeKey = (r: { institute: string; program: string; category: string; gender_pool: string }) =>
      `${r.institute}|${r.program}|${r.category}|${r.gender_pool}`

    const r1Records = josaaData[1] || []
    const r6Records = josaaData[6] || []

    const r1Map = new Map<string, number>()
    for (const r of r1Records) {
      r1Map.set(makeKey(r), r.opening_rank)
    }

    const r6Map = new Map<string, number>()
    for (const r of r6Records) {
      r6Map.set(makeKey(r), r.closing_rank)
    }

    // ── Tier classification ──────────────────────────────────────
    // dream:     closing_rank < predicted  (cutoff lower than our rank = tougher)
    // realistic: predicted <= closing_rank <= worst
    // safe:      closing_rank > worst
    const classified = colleges.map(college => {
      let tier: 'dream' | 'realistic' | 'safe'
      const cr = college.closing_rank
      if (cr < predicted) {
        tier = 'dream'
      } else if (cr <= worst) {
        tier = 'realistic'
      } else {
        tier = 'safe'
      }
      const key = makeKey(college)
      return {
        ...college,
        tier,
        r1_opening: r1Map.get(key) ?? college.opening_rank,
        r6_closing: r6Map.get(key) ?? college.closing_rank,
      }
    })

    let results

    if (isFullList) {
      // Dashboard: return all up to limit
      results = classified.slice(0, limit)
    } else {
      // Free preview (landing page): return ALL matches grouped by tier
      // Frontend handles preview/expand logic
      const dreamList     = classified.filter(c => c.tier === 'dream')
      const realisticList = classified.filter(c => c.tier === 'realistic')
      const safeList      = classified.filter(c => c.tier === 'safe')
      results = [...dreamList, ...realisticList, ...safeList]
    }

    return NextResponse.json({ total: results.length, results })
  } catch (err) {
    console.error('college-matches error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
