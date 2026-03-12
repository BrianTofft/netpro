'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/categories'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      {/* Top bar — navy */}
      <div className="bg-[#1C3A6E] text-sm py-1.5 px-4 text-blue-100 flex items-center justify-between">
        <span className="hidden sm:block">Gratis fragt • Min. 3 års garanti • Direkte fra Amazon.de</span>
        <span className="sm:hidden">Gratis fragt • Min. 3 års garanti</span>
        <a href="mailto:info@netpro.dk" className="hover:text-white transition-colors">
          ✉️ info@netpro.dk
        </a>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Netpro"
            height={44}
            width={180}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setActiveDropdown(cat.slug)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={`/${cat.slug}`}
                className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium text-[#1C3A6E] hover:bg-[#EEF2FA] transition-colors whitespace-nowrap"
              >
                {cat.name}
                {cat.subs && (
                  <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>

              {cat.subs && activeDropdown === cat.slug && (
                <div className="absolute top-full left-0 bg-white text-[#1A1A1A] shadow-xl rounded-b-lg min-w-[220px] py-2 z-50 border border-gray-100">
                  {cat.subs.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${cat.slug}/${sub.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-[#EEF2FA] hover:text-[#1C3A6E] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('__more')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium text-[#1C3A6E] hover:bg-[#EEF2FA] transition-colors">
              Mere
              <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {activeDropdown === '__more' && (
              <div className="absolute top-full right-0 bg-white text-[#1A1A1A] shadow-xl rounded-b-lg min-w-[220px] py-2 z-50 border border-gray-100">
                {CATEGORIES.slice(6).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-[#EEF2FA] hover:text-[#1C3A6E] transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Search + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#1C3A6E] rounded-lg px-3 py-2 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-500">Søg produkter...</span>
          </Link>

          <button
            className="lg:hidden p-2 rounded text-[#1C3A6E] hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 pb-4">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <Link
              href="/search"
              className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 mb-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Søg produkter...
            </Link>
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="flex items-center gap-2 py-2.5 text-sm font-medium text-[#1C3A6E] border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
                {cat.subs?.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/${cat.slug}/${sub.slug}`}
                    className="block pl-8 py-2 text-sm text-gray-500 hover:text-[#1C3A6E]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
