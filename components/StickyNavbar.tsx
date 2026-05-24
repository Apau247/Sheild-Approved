'use client'

import { useState } from 'react'
import { Menu, X, ShieldCheck } from 'lucide-react'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#verification', label: 'Verification' },
  { href: '#tracking', label: 'Tracking' },
  { href: '#stats', label: 'Metrics' },
  { href: '#contact', label: 'Contact' },
]

export default function StickyNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="inline-flex items-center gap-3 text-lg font-semibold text-white transition hover:text-emerald-300">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-900/10">
            <ShieldCheck className="h-5 w-5" />
          </span>
          Shield Approved
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-200 transition hover:bg-slate-800 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 sm:px-6 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900/80"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
