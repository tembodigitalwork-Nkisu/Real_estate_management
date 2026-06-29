// Server-side data access for properties. Used by public pages.
// All queries run through the anon client, so RLS guarantees only published
// listings are ever returned to the public site.

import { createClient } from '@/lib/supabase/server';
import type { ListingType, Property, PropertyType } from './types';

export interface ListingFilters {
  listingType?: ListingType;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
}

export async function getPublishedProperties(
  filters: ListingFilters = {},
): Promise<Property[]> {
  const supabase = await createClient();
  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.listingType) query = query.eq('listing_type', filters.listingType);
  if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
  if (filters.city) query = query.ilike('city', `%${filters.city}%`);
  if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
  if (filters.minPrice) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error('getPublishedProperties failed:', error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getFeaturedProperties failed:', error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Look up a single published property by id OR slug (slug preferred for URLs).
// We branch on the value's shape because comparing a non-UUID string to the
// uuid `id` column makes Postgres raise a cast error.
export async function getPropertyByIdOrSlug(
  idOrSlug: string,
): Promise<Property | null> {
  const supabase = await createClient();
  const column = UUID_RE.test(idOrSlug) ? 'id' : 'slug';
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq(column, idOrSlug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('getPropertyByIdOrSlug failed:', error.message);
    return null;
  }
  return (data as Property) ?? null;
}

// Distinct cities for the filter dropdown.
export async function getListingCities(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('city')
    .eq('status', 'published')
    .not('city', 'is', null);

  if (error || !data) return [];
  return Array.from(new Set(data.map((r) => r.city as string))).sort();
}
