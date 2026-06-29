import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Maximize, MapPin } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatPrice, formatArea, propertyTypeLabel } from '@/lib/format';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200';

export function PropertyCard({ property }: { property: Property }) {
  const href = `/listings/${property.slug ?? property.id}`;
  const cover = property.images[0] ?? FALLBACK_IMAGE;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-brand-600 px-2 py-1 text-xs font-semibold text-white">
          {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
        {property.featured && (
          <span className="absolute right-3 top-3 rounded-md bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-lg font-bold text-brand-700">
          {formatPrice(property.price, property.currency, property.listing_type)}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-slate-900">
          {property.title}
        </h3>
        {(property.address || property.city) && (
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-1">
              {[property.address, property.city].filter(Boolean).join(', ')}
            </span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-sm text-slate-600">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" aria-hidden /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" aria-hidden /> {property.bathrooms}
            </span>
          )}
          {property.area_sqm != null && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" aria-hidden /> {formatArea(property.area_sqm)}
            </span>
          )}
          <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {propertyTypeLabel(property.property_type)}
          </span>
        </div>
      </div>
    </Link>
  );
}
