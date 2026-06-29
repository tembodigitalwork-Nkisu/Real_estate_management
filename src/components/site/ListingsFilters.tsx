'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Filter controls for the listings page. Each change rewrites the URL query
// string, which re-runs the server component and refetches filtered data.
export function ListingsFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  const field =
    'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700';

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
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
    </div>
  );
}
