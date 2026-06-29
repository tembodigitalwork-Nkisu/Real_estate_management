import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BedDouble, Bath, Maximize, MapPin, ArrowLeft, Building2 } from 'lucide-react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Gallery } from '@/components/site/Gallery';
import { getPropertyByIdOrSlug } from '@/lib/queries';
import { formatPrice, formatArea, propertyTypeLabel } from '@/lib/format';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyByIdOrSlug(id);
  if (!property) return { title: 'Property not found' };
  return {
    title: property.title,
    description: property.description ?? undefined,
    openGraph: {
      title: property.title,
      images: property.images[0] ? [property.images[0]] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const property = await getPropertyByIdOrSlug(id);
  if (!property) notFound();

  const facts = [
    property.bedrooms != null && { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
    property.bathrooms != null && { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    property.area_sqm != null && { icon: Maximize, label: 'Area', value: formatArea(property.area_sqm) },
    { icon: Building2, label: 'Type', value: propertyTypeLabel(property.property_type) },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: React.ReactNode }[];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to listings
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <Gallery images={property.images} alt={property.title} />

            <div className="mt-8">
              <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
              {(property.address || property.city) && (
                <p className="mt-2 flex items-center gap-1 text-slate-600">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {[property.address, property.city, property.province].filter(Boolean).join(', ')}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-lg border border-slate-200 p-4">
                    <f.icon className="h-5 w-5 text-brand-600" aria-hidden />
                    <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{f.label}</p>
                    <p className="font-semibold text-slate-900">{f.value}</p>
                  </div>
                ))}
              </div>

              {property.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-slate-900">Description</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
                    {property.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky enquiry card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 p-6 shadow-sm">
              <span className="inline-block rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              <p className="mt-3 text-3xl font-bold text-brand-700">
                {formatPrice(property.price, property.currency, property.listing_type)}
              </p>
              <Link
                href={`/contact?property=${encodeURIComponent(property.title)}`}
                className="mt-6 block rounded-lg bg-brand-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Enquire about this property
              </Link>
              <a
                href="tel:+260000000000"
                className="mt-3 block rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Call agent
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
