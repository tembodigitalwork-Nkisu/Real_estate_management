import Link from 'next/link';
import { Building2 } from 'lucide-react';

const nav = [
  { href: '/listings?listing_type=sale', label: 'For Sale' },
  { href: '/listings?listing_type=rent', label: 'For Rent' },
  { href: '/listings', label: 'All Listings' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Building2 className="h-6 w-6 text-brand-600" aria-hidden />
          <span>Acacia Properties</span>
        </Link>

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

        <Link
          href="/admin"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Portal
        </Link>
      </div>
    </header>
  );
}
