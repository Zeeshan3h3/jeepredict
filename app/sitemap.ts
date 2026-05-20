import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jeepredict.in'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              siteUrl + '/',
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         1.0
    },
    {
      url:              siteUrl + '/jee-advanced-marks-vs-rank-2026',
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.9
    },
    {
      url:              siteUrl + '/josaa-cutoff-2026',
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.8
    }
  ]

  try {
    const { data: institutes, error } = await supabaseAdmin
      .from('josaa_cutoffs')
      .select('institute')

    if (error) {
      console.error('Error fetching institutes for sitemap:', error)
      return staticPages
    }

    // Extract unique institute names
    const uniqueInstitutes = Array.from(new Set(institutes?.map(row => row.institute) || []))

    const dynamicPages: MetadataRoute.Sitemap = uniqueInstitutes.map((institute: string) => {
      let slug = institute.toLowerCase()
      slug = slug.replace(/[^a-z0-9]+/g, '-') // Replace spaces and special chars with hyphens
      slug = slug.replace(/-+/g, '-')         // Deduplicate consecutive hyphens
      slug = slug.replace(/^-|-$/g, '')       // Trim trailing/leading hyphens
      
      return {
        url:             `${siteUrl}/${slug}-cutoff-2026`,
        lastModified:    new Date(),
        changeFrequency: 'monthly',
        priority:        0.7
      }
    })

    return [...staticPages, ...dynamicPages]
  } catch (err) {
    console.error('Sitemap generation error:', err)
    return staticPages
  }
}
