import Link from 'next/link'

export const metadata = {
  title: '404 — Page Not Found | JEEPredict 2026',
  description: 'This page does not exist. Go back to the free JEE Advanced rank predictor.',
  robots: { index: false, follow: true }
}

export default function NotFound() {
  return (
    <div className="bg-[#F5F7FF] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-8xl font-black text-[#E2E8F4] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#0F1B4C] mb-2">Page not found</h2>
        <p className="text-gray-400 text-sm mb-8">
          The page you're looking for doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/"
            className="bg-[#FF6B35] text-white rounded-xl px-6 py-3 font-semibold transition-colors hover:bg-[#E85B28]"
          >
            Go to Rank Predictor
          </Link>
          <Link 
            href="/iit-bombay-cutoff-2026"
            className="border border-[#E2E8F4] text-[#0F1B4C] rounded-xl px-6 py-3 font-semibold transition-colors hover:bg-white"
          >
            View IIT Cutoffs
          </Link>
        </div>

        <div className="text-sm">
          <p className="text-gray-400 mb-2">Popular pages:</p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="text-[#FF6B35] hover:underline">
              Home
            </Link>
            <Link href="/jee-advanced-marks-vs-rank-2026" className="text-[#FF6B35] hover:underline">
              Marks vs Rank 2026
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
