import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'

export const FOOTER_OVERRIDE_ENABLED = true

export function FooterOverride() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-neutral-900 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
