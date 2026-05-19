'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth-helpers'

interface DashboardNavProps {
  student: { name: string; phone: string } | null
}

export default function DashboardNav({ student }: DashboardNavProps) {
  const firstName = student?.name?.split(' ')[0] ?? ''
  const initials = student?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'

  async function handleLogout() {
    await signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F4] px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: logo + breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.png"
              height={32}
              width={110}
              alt="JEEPredict"
              className="object-contain"
            />
          </Link>
          <span className="text-gray-300 text-sm">/</span>
          <span className="text-gray-400 text-sm">Dashboard</span>
        </div>

        {/* Right: user chip + logout */}
        <div className="flex items-center gap-3">
          {/* Desktop: full name */}
          <div className="hidden md:flex items-center gap-2 bg-[#F5F7FF] border border-[#E2E8F4] rounded-xl px-3 py-1.5">
            <User size={14} className="text-[#0F1B4C]" />
            <span className="text-sm text-[#0F1B4C] font-medium">{student?.name ?? '...'}</span>
          </div>

          {/* Mobile: initials */}
          <div className="md:hidden w-8 h-8 rounded-full bg-[#FF6B35] text-white text-xs font-bold flex items-center justify-center">
            {initials}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-[#E2E8F4] text-gray-500 rounded-xl px-3 py-1.5 text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
