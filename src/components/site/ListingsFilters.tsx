'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Filter controls for the listings page. Each change rewrites the URL query
// string, which re-runs the server component and refetches filtered data.
export function ListingsFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  // Track the refetch so we can show a pending state instead of a dead pause.
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  // Price inputs: keep digits only, drop the param when cleared.
  function updatePrice(key: 'min_price' | 'max_price', raw: string) {
    const digits = raw.replace(/[^\d]/g, '');
    update(key, digits);
  }

  const hasFilters = Array.from(params.keys()).length > 0;

  const field =
    'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700';

  return (
    <div
      aria-busy={isPending}
      className={`relative grid gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${
        isPending ? 'opacity-60' : ''
      }`}
    >
      {isPending && (
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 text-xs font-medium text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Updating
        </span>
      )}
      <input
        defaultValue={params.get('q') ?? ''}
        onBlur={(e) => update('q', e.target.value.trim())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') update('q', (e.target as HTMLInputElement).value.trim());
        }}
        placeholder="Search…"
        className={`${field} lg:col-span-2`}
      />

      <select value={params.get('listing_type') ?? ''} onChange={(e) => update('listing_type', e.target.value)} className={field}>
        <option value="">Buy or Rent</option>
        <option value="sale">For Sale</option>
        <option value="rent">For Rent</option>
      </select>

      <select value={params.get('property_type') ?? ''} onChange={(e) => update('property_type', e.target.value)} className={field}>
        <option value="">Any type</option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="townhouse">Townhouse</option>
        <option value="land">Land</option>
        <option value="office">Office</option>
        <option value="commercial">Commercial</option>
      </select>

      <select value={params.get('city') ?? ''} onChange={(e) => update('city', e.target.value)} className={field}>
        <option value="">Any city</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select value={params.get('beds') ?? ''} onChange={(e) => update('beds', e.target.value)} className={field}>
        <option value="">Any beds</option>
        <option value="1">1+ beds</option>
        <option value="2">2+ beds</option>
        <option value="3">3+ beds</option>
        <option value="4">4+ beds</option>
      </select>

      <input
        type="number"
        min="0"
        inputMode="numeric"
        defaultValue={params.get('min_price') ?? ''}
        onBlur={(e) => updatePrice('min_price', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') updatePrice('min_price', (e.target as HTMLInputElement).value);
        }}
        placeholder="Min price"
        className={field}
      />

      <input
        type="number"
        min="0"
        inputMode="numeric"
        defaultValue={params.get('max_price') ?? ''}
        onBlur={(e) => updatePrice('max_price', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') updatePrice('max_price', (e.target as HTMLInputElement).value);
        }}
        placeholder="Max price"
        className={field}
      />

      {hasFilters && (
        <div className="flex items-center justify-end sm:col-span-2 lg:col-span-4">
          <button
            type="button"
            onClick={() => startTransition(() => router.push(pathname))}
            className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-brand-700 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
