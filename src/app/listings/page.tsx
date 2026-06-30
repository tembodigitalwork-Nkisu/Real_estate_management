import type { Metadata } from 'next';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ListingsFilters } from '@/components/site/ListingsFilters';
import { PropertyCard } from '@/components/PropertyCard';
import { getPublishedProperties, getListingCities } from '@/lib/queries';
import type { ListingType, PropertyType } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Listings',
  description: 'Browse all available properties for sale and rent.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  // Parse a positive number from a query param, ignoring blanks/garbage.
  const num = (v: string | string[] | undefined): number | undefined => {
    const raw = one(v);
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const [properties, cities] = await Promise.all([
    getPublishedProperties({
      listingType: one(sp.listing_type) as ListingType | undefined,
      propertyType: one(sp.property_type) as PropertyType | undefined,
      city: one(sp.city),
      bedrooms: num(sp.beds),
      minPrice: num(sp.min_price),
      maxPrice: num(sp.max_price),
      search: one(sp.q),
    }),
    getListingCities(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Property listings</h1>
        <p className="mt-1 text-slate-600">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
        </p>

        <div className="mt-6">
          <ListingsFilters cities={cities} />
        </div>

        {properties.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-lg font-medium text-slate-700">No properties match your filters.</p>
            <p className="mt-1 text-sm text-slate-500">Try widening your search or clearing some filters.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
