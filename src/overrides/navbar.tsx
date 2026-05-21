'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export const NAVBAR_OVERRIDE_ENABLED = true

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Latest News', href: '/updates' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function NavbarOverride() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt={SITE_CONFIG.name}
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Center nav links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3.5 py-2 text-[14px] font-medium transition-colors',
                  isActive
                    ? 'text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right: search + CTA */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          <Link
            href="/create/mediaDistribution"
            className="hidden rounded-full bg-[#1a1f36] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d3452] sm:inline-flex"
          >
            Submit Release
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2">
              <Link
                href="/create/mediaDistribution"
                onClick={() => setMobileOpen(false)}
                className="block rounded-full bg-[#1a1f36] px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Submit Release
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
