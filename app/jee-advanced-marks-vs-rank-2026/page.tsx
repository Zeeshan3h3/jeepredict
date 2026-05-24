import Link from 'next/link'
import marksData from '@/data/marks-to-rank.json'

export const metadata = {
  title: 'JEE Advanced Marks vs Rank 2026 — Official Data Table',
  description:
    'Complete JEE Advanced 2026 marks vs rank data for GEN, OBC-NCL, ' +
    'EWS, SC and ST categories. Find out what rank corresponds to your ' +
    'marks with our free rank predictor.',
  alternates: { canonical: '/jee-advanced-marks-vs-rank-2026' },
  openGraph: {
    title:       'JEE Advanced Marks vs Rank 2026 — Full Data Table',
    description: 'Category-wise marks vs rank data for JEE Advanced 2026.',
    url:         '/jee-advanced-marks-vs-rank-2026'
  }
}

export default function MarksVsRankPage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  const currentCategory = searchParams.category || 'GEN'
  const categories = ['GEN', 'OBC-NCL', 'EWS', 'SC', 'ST']
  
  // Cast the imported JSON to avoid TypeScript any-type errors
  const typedMarksData = marksData as Record<string, { rank: number; marks: number }[]>
  const categoryData = typedMarksData[currentCategory] || []
  
  // Keep every 5th row for readability, plus the first one
  const displayData = categoryData.filter((_, index) => index === 0 || index % 5 === 0)

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type":    "ListItem",
        "position": 1,
        "name":     "Home",
        "item":     "https://jeepredict.in/"
      },
      {
        "@type":    "ListItem",
        "position": 2,
        "name":     "JEE Advanced Marks vs Rank 2026",
        "item":     "https://jeepredict.in/jee-advanced-marks-vs-rank-2026"
      }
    ]
  }

  const datasetSchema = {
    "@context":       "https://schema.org",
    "@type":          "Dataset",
    "name":           "JEE Advanced 2026 Marks vs Rank Data",
    "description":    "Category-wise marks to rank mapping for JEE Advanced 2026",
    "keywords":       ["JEE Advanced", "rank predictor", "marks vs rank", "2026"],
    "creator": {
      "@type": "Organization",
      "name":  "JEEPredict"
    },
    "temporalCoverage": "2025/2026",
    "spatialCoverage":  "IN",
    "license":          "https://creativecommons.org/licenses/by/4.0/"
  }

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="bg-[#0F1B4C] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link> &gt; JEE Advanced Marks vs Rank 2026
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            JEE Advanced 2026 Marks vs Rank
          </h1>
          <p className="text-white/60 text-sm">
            Official category-wise data · Updated for 2025–26
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* SECTION 2: INTRO */}
        <section className="mb-12 text-[#0F1B4C] leading-relaxed">
          <p className="mb-4">
            Understanding the <strong>JEE Advanced marks vs rank 2026</strong> mapping is a crucial step for all 
            engineering aspirants aiming for admission into the prestigious Indian Institutes of Technology (IITs). 
            The correlation between your final score (typically out of 360 marks across Paper 1 and Paper 2) and your 
            final All India Rank (AIR) or category-wise rank determines your eligibility for specific engineering 
            branches during the <strong>JoSAA cutoff</strong> counseling process.
          </p>
          <p>
            The historical data presented below lists the official marks vs rank trends, categorized by General (GEN), 
            OBC-NCL, EWS, SC, and ST categories. By carefully analyzing this data, you can set realistic academic targets, 
            prepare a robust preparation strategy, and gauge your potential IIT matches.
          </p>
        </section>

        {/* SECTION 3: TABS + TABLE */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <Link 
                key={cat}
                href={`/jee-advanced-marks-vs-rank-2026?category=${cat}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  currentCategory === cat 
                    ? 'bg-[#0F1B4C] text-white' 
                    : 'bg-[#F5F7FF] text-[#0F1B4C] hover:bg-[#E2E8F4]'
                }`}
                scroll={false}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="overflow-x-auto border border-[#E2E8F4] rounded-xl">
            <table className="w-full text-left text-sm text-[#0F1B4C]">
              <thead className="bg-[#0F1B4C] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Rank Range</th>
                  <th className="px-6 py-4 font-semibold">Minimum Marks (Out of 360)</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, i) => (
                  <tr 
                    key={row.rank} 
                    className={`border-t border-[#E2E8F4] ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FF]'}`}
                  >
                    <td className="px-6 py-4 font-medium">Rank {row.rank}</td>
                    <td className="px-6 py-4">{row.marks} Marks</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: INLINE CTA */}
        <section className="bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-2xl p-6 text-center mb-12">
          <h3 className="text-xl font-bold text-[#0F1B4C] mb-4">Want to know YOUR exact rank?</h3>
          <Link 
            href="/#predictor"
            className="inline-block bg-[#FF6B35] text-white font-semibold px-6 py-3 rounded-xl transition hover:bg-[#E85B28]"
          >
            Use Free Rank Predictor →
          </Link>
        </section>

        {/* SECTION 5: EXPLANATORY CONTENT */}
        <section className="mb-12 text-[#0F1B4C] leading-relaxed">
          <h2 className="text-2xl font-bold mb-4">How JEE Advanced Ranks Are Calculated</h2>
          <p className="mb-4">
            The Joint Entrance Examination (JEE) Advanced rank calculation is determined by the aggregate score 
            obtained by candidates in both Paper 1 and Paper 2. IIT authorities compile a rank list by applying 
            subject-wise minimum percentage criteria as well as aggregate cutoff percentages. These cutoff marks 
            fluctuate every year depending on the overall difficulty level of the examination, the total number 
            of registered candidates, and individual category allocations.
          </p>
          <p className="mb-4">
            During JoSAA (Joint Seat Allocation Authority) counseling, these closing ranks determine seat allocations. 
            To make this data actionable, our JEE Advanced 2026 rank predictor categorizes your predicted options 
            into three distinct tiers:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Dream Colleges:</strong> Top-tier IITs where your expected rank is slightly below or close to the previous year&apos;s cutoff, indicating a stretch target.</li>
            <li><strong>Realistic Colleges:</strong> Mid-to-high-tier IITs where your rank aligns comfortably with past trends, giving you a strong chance of admission.</li>
            <li><strong>Safe Colleges:</strong> Stable options where your score significantly exceeds the closing rank, ensuring a guaranteed seat.</li>
          </ul>
          <p>
            By evaluating the detailed marks vs rank table above, you can plan your target scores for each paper 
            and utilize our predictor to receive real-time, data-backed insights on which colleges you qualify for.
          </p>
        </section>

        {/* SECTION 6: SECOND CTA */}
        <section className="bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-[#0F1B4C] mb-4">Ready to find your IIT?</h3>
          <Link 
            href="/#predictor"
            className="inline-block bg-[#FF6B35] text-white font-semibold px-6 py-3 rounded-xl transition hover:bg-[#E85B28]"
          >
            Use Free Rank Predictor →
          </Link>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
    </>
  )
}
