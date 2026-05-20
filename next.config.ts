import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security (also helps SEO trust signals)
          {
            key:   'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key:   'X-Frame-Options',
            value: 'DENY'
          },
          {
            key:   'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key:   'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key:   'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Performance caching
          {
            key:   'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      },
      // Long cache for static assets
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|woff2|woff)',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // No cache for API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key:   'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
