'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

export interface PropertyFormState {
  error?: string;
}

// Turn a kebab/space title into a URL-friendly slug.
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const num = (key: string): number | null => {
    const raw = String(formData.get(key) ?? '').trim();
    if (raw === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };
  const images = String(formData.get('images') ?? '')
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    title,
    slug: slugify(title),
    description: String(formData.get('description') ?? '').trim() || null,
    property_type: String(formData.get('property_type') ?? 'house'),
    listing_type: String(formData.get('listing_type') ?? 'sale'),
    status: String(formData.get('status') ?? 'draft'),
    price: num('price') ?? 0,
    currency: String(formData.get('currency') ?? 'ZMW').trim() || 'ZMW',
    bedrooms: num('bedrooms'),
    bathrooms: num('bathrooms'),
    area_sqm: num('area_sqm'),
    address: String(formData.get('address') ?? '').trim() || null,
    city: String(formData.get('city') ?? '').trim() || null,
    province: String(formData.get('province') ?? '').trim() || null,
    featured: formData.get('featured') === 'on',
    images,
  };
}

export async function createProperty(
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const { supabase } = await requireAdmin();
  const values = parseForm(formData);
  if (!values.title) return { error: 'Title is required.' };

  const { error } = await supabase.from('properties').insert(values);
  if (error) {
    // Likely a duplicate slug; nudge the user to tweak the title.
    return { error: error.message };
  }

  revalidatePath('/admin/properties');
  revalidatePath('/listings');
  redirect('/admin/properties');
}

export async function updateProperty(
  id: string,
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const { supabase } = await requireAdmin();
  const values = parseForm(formData);
  if (!values.title) return { error: 'Title is required.' };

  const { error } = await supabase.from('properties').update(values).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/listings');
  revalidatePath(`/listings/${values.slug}`);
  redirect('/admin/properties');
}

export async function deleteProperty(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await supabase.from('properties').delete().eq('id', id);
    revalidatePath('/admin/properties');
    revalidatePath('/listings');
  }
}
