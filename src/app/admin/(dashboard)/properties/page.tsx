import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatPrice } from '@/lib/format';
import type { Property } from '@/lib/types';
import { deleteProperty } from './actions';

export const metadata = { title: 'Properties' };

const statusStyles: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
  archived: 'bg-slate-200 text-slate-600',
};

export default async function PropertiesAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  const properties = (data ?? []) as Property[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-slate-500">{properties.length} total</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" aria-hidden /> Add property
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-500">{[p.city, p.province].filter(Boolean).join(', ')}</p>
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">
                  {p.property_type} · {p.listing_type}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatPrice(p.price, p.currency, p.listing_type)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[p.status] ?? ''}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {p.status === 'published' && (
                      <Link
                        href={`/listings/${p.slug ?? p.id}`}
                        target="_blank"
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </Link>
                    )}
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </Link>
                    <form action={deleteProperty}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No properties yet. Click “Add property” to create your first listing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
