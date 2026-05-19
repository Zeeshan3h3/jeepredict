import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, marks, category, gender, predicted_rank } = body

    // Validate
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (marks !== null && marks !== undefined && (marks < 0 || marks > 360)) {
      return NextResponse.json({ error: 'Marks must be between 0 and 360' }, { status: 400 })
    }
    const validCategories = ['GEN', 'OBC-NCL', 'EWS', 'SC', 'ST']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Upsert student profile
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .upsert(
        {
          id: session.user.id,
          name: name.trim(),
          phone: session.user.phone ?? '',
          email: email ?? null,
          marks: marks ?? null,
          category: category ?? null,
          gender: gender ?? null,
          predicted_rank: predicted_rank ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )

    if (studentError) {
      console.error('student upsert error:', studentError)
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    // Also upsert to leads table (fire-and-forget)
    supabaseAdmin
      .from('leads')
      .upsert(
        {
          name: name.trim(),
          phone: session.user.phone ?? '',
          email: email ?? null,
          marks: marks ?? 0,
          category: category ?? '',
          gender: gender ?? '',
          rank_mid: predicted_rank ?? 0,
        },
        { onConflict: 'phone' }
      )
      .then(({ error }) => {
        if (error) console.error('leads upsert error:', error)
      })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('student/save error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
