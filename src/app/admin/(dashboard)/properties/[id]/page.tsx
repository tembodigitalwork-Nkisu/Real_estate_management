import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { updateProperty } from '../actions';
import type { Property } from '@/lib/types';

export const metadata = { title: 'Edit property' };

type Params = Promise<{ id: string }>;

export default async function EditPropertyPage({ params }: { params: Params }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase.from('properties').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const property = data as Property;

  // Bind the row id so the shared form can call a (prev, formData) action.
  const action = updateProperty.bind(null, id);

  return (
    <div>
      <Link href="/admin/properties" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to properties
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold text-slate-900">Edit property</h1>
      <PropertyForm action={action} property={property} submitLabel="Save changes" />
    </div>
  );
}
