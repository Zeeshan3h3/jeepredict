'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, loading } = useAuth()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0F1B4C] border-b border-white/10 backdrop-blur-md">
      <div className="px-4 md:px-8 lg:px-16 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            height={40}
            width={140}
            alt="JEEPredict"
            className="object-contain"
            priority
          />
          <span className="hidden md:inline font-bold text-white text-lg">JEEPredict 2026</span>
        </Link>

        {/* Right — Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollTo('how-it-works')}
            className="text-white/80 hover:text-white text-sm font-medium transition"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo('predictor')}
            className="text-white/80 hover:text-white text-sm font-medium transition"
          >
            Predict My Rank
          </button>

          {/* Auth-aware CTA */}
          {!loading && user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition"
            >
              <LayoutDashboard size={14} />
              My Dashboard
            </Link>
          ) : (
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF6B35] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              📞 Book Counselling
            </a>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0F1B4C] border-t border-white/10 ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col px-4 py-2">
          <button
            onClick={() => scrollTo('how-it-works')}
            className="text-white/80 hover:text-white text-sm font-medium py-3 text-left transition"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo('predictor')}
            className="text-white/80 hover:text-white text-sm font-medium py-3 text-left transition"
          >
            Predict My Rank
          </button>

          {!loading && user ? (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-white text-sm font-semibold py-3 text-left transition"
            >
              <LayoutDashboard size={14} />
              My Dashboard
            </Link>
          ) : (
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="bg-[#FF6B35] text-white text-sm font-semibold px-4 py-3 rounded-xl hover:opacity-90 transition mt-2 mb-3 text-center"
            >
              📞 Book Counselling
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
