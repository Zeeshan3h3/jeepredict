import { NextResponse } from 'next/server';
import { getRankRange } from '@/lib/rank-lookup';
import { Category } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalMarks, category, gender } = body;

    const rankResult = getRankRange(totalMarks, category as Category);

    if (!rankResult) {
      return NextResponse.json({
        qualified: false,
        message: "Score is below the qualifying cutoff for your category."
      });
    }

    return NextResponse.json({
      qualified: true,
      displayRank: rankResult.displayRank,
      confidenceNote: "Based on 2025 JEE Advanced data. Actual rank may vary by ±5%."
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
