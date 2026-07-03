'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Building2, Menu, X } from 'lucide-react';

const nav = [
  { href: '/listings?listing_type=sale', label: 'For Sale' },
  { href: '/listings?listing_type=rent', label: 'For Rent' },
  { href: '/listings', label: 'All Listings' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-semibold text-slate-900"
        >
          <Building2 className="h-6 w-6 text-brand-600" aria-hidden />
          <span>Acacia Properties</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Portal
          </Link>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-4 py-2 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
