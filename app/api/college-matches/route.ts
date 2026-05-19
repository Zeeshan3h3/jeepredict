import { NextResponse } from 'next/server'
import { getRankRange } from '@/lib/rank-lookup'
import { Category } from '@/types/database'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marks, category, gender, limit = 10 } = body

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
    //
    // We cast a wide net and classify on the fly.
    const lowerBound = Math.max(1, Math.round(best * 0.5))
    const upperBound = Math.round(worst * 2.0)

    const { data: colleges, error } = await supabaseAdmin
      .from('josaa_cutoffs')
      .select('id, institute, program, quota, category, gender_pool, opening_rank, closing_rank, year')
      .eq('category', category)
      .in('gender_pool', genderPools)
      .gte('closing_rank', lowerBound)
      .lte('closing_rank', upperBound)
      .eq('year', 2025)
      .order('closing_rank', { ascending: true })

    if (error) {
      console.error('college-matches DB error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const isFullList = limit > 10  // dashboard mode vs free preview mode

    // ── Tier classification ──────────────────────────────────────
    // dream:     closing_rank < predicted  (cutoff lower than our rank = tougher)
    // realistic: predicted <= closing_rank <= worst
    // safe:      closing_rank > worst
    const classified = (colleges ?? []).map(college => {
      let tier: 'dream' | 'realistic' | 'safe'
      const cr = college.closing_rank
      if (cr < predicted) {
        tier = 'dream'
      } else if (cr <= worst) {
        tier = 'realistic'
      } else {
        tier = 'safe'
      }
      return { ...college, tier }
    })

    let results

    if (isFullList) {
      // Dashboard: return all up to limit
      results = classified.slice(0, limit)
    } else {
      // Free preview (landing page): cap per tier then take top N
      const dreamList     = classified.filter(c => c.tier === 'dream').slice(0, 3)
      const realisticList = classified.filter(c => c.tier === 'realistic').slice(0, 4)
      const safeList      = classified.filter(c => c.tier === 'safe').slice(0, 3)
      results = [...dreamList, ...realisticList, ...safeList].slice(0, limit)
    }

    return NextResponse.json({ total: results.length, results })
  } catch (err) {
    console.error('college-matches error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
