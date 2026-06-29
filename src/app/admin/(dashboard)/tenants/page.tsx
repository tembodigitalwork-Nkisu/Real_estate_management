import { Trash2, UserPlus } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import type { Tenant } from '@/lib/types';
import { createTenant, deleteTenant } from './actions';

export const metadata = { title: 'Tenants' };

const input = 'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800';

export default async function TenantsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('tenants').select('*').order('full_name');
  const tenants = (data ?? []) as Tenant[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
      <p className="mt-1 text-slate-500">{tenants.length} on record</p>

      {/* Add tenant */}
      <form
        action={createTenant}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <input name="full_name" required placeholder="Full name" className={input} />
        <input name="email" type="email" placeholder="Email" className={input} />
        <input name="phone" placeholder="Phone" className={input} />
        <input name="national_id" placeholder="National ID" className={input} />
        <input name="notes" placeholder="Notes (optional)" className={`${input} sm:col-span-2 lg:col-span-3`} />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <UserPlus className="h-4 w-4" aria-hidden /> Add tenant
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">National ID</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{t.full_name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {t.email && <div>{t.email}</div>}
                  {t.phone && <div className="text-slate-500">{t.phone}</div>}
                </td>
                <td className="px-4 py-3 text-slate-600">{t.national_id ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(t.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteTenant}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No tenants yet. Add one using the form above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
