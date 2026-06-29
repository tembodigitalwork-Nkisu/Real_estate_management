import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { createProperty } from '../actions';

export const metadata = { title: 'Add property' };

export default async function NewPropertyPage() {
  await requireAdmin();

  return (
    <div>
      <Link href="/admin/properties" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to properties
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold text-slate-900">Add property</h1>
      <PropertyForm action={createProperty} submitLabel="Create property" />
    </div>
  );
}
