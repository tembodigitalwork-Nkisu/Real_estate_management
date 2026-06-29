'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

// Compact search used on the home hero. Builds a query string and navigates
// to /listings, where the server reads the params and filters the data.
export function SearchBar() {
  const router = useRouter();
  const [listingType, setListingType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [search, setSearch] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set('listing_type', listingType);
    if (propertyType) params.set('property_type', propertyType);
    if (search.trim()) params.set('q', search.trim());
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]"
    >
      <select
        aria-label="Listing type"
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700"
      >
        <option value="">Buy or Rent</option>
        <option value="sale">For Sale</option>
        <option value="rent">For Rent</option>
      </select>

      <select
        aria-label="Property type"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700"
      >
        <option value="">Any type</option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="townhouse">Townhouse</option>
        <option value="land">Land</option>
        <option value="office">Office</option>
        <option value="commercial">Commercial</option>
      </select>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by area, suburb or keyword"
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700"
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <Search className="h-4 w-4" aria-hidden /> Search
      </button>
    </form>
  );
}
