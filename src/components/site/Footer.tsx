import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Building2 className="h-5 w-5 text-brand-600" aria-hidden />
            <span>Acacia Properties</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-600">
            Houses, apartments, land and commercial property for sale and rent
            across Zambia.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/listings?listing_type=sale" className="hover:text-brand-700">For Sale</Link></li>
            <li><Link href="/listings?listing_type=rent" className="hover:text-brand-700">For Rent</Link></li>
            <li><Link href="/listings" className="hover:text-brand-700">All Listings</Link></li>
            <li><Link href="/contact" className="hover:text-brand-700">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Lusaka, Zambia</li>
            <li>hello@acaciaproperties.zm</li>
            <li>+260 000 000 000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {year} Acacia Properties. All rights reserved.
      </div>
    </footer>
  );
}
