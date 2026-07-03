import { FilePlus } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatDate, formatPrice } from '@/lib/format';
import type { Property, Tenant } from '@/lib/types';
import { createLease, updateLeaseStatus } from './actions';

export const metadata = { title: 'Leases' };

// Shape returned by the relational select below.
interface LeaseRow {
  id: string;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  deposit: number;
  currency: string;
  status: string;
  properties: { title: string } | null;
  tenants: { full_name: string } | null;
}

const input = 'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800';
const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  ended: 'bg-slate-200 text-slate-600',
  terminated: 'bg-red-100 text-red-700',
};

export default async function LeasesPage() {
  const { supabase } = await requireAdmin();

  const [leasesRes, propsRes, tenantsRes] = await Promise.all([
    supabase
      .from('leases')
      .select('id,start_date,end_date,rent_amount,deposit,currency,status,properties(title),tenants(full_name)')
      .order('start_date', { ascending: false }),
    supabase.from('properties').select('id,title').order('title'),
    supabase.from('tenants').select('id,full_name').order('full_name'),
  ]);

  const leases = (leasesRes.data ?? []) as unknown as LeaseRow[];
  const properties = (propsRes.data ?? []) as Pick<Property, 'id' | 'title'>[];
  const tenants = (tenantsRes.data ?? []) as Pick<Tenant, 'id' | 'full_name'>[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Leases</h1>
      <p className="mt-1 text-slate-500">{leases.length} on record</p>

      {/* New lease */}
      <form action={createLease} className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:grid-cols-4">
        <select name="property_id" required className={input} defaultValue="">
          <option value="" disabled>Select property…</option>
          {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select name="tenant_id" required className={input} defaultValue="">
          <option value="" disabled>Select tenant…</option>
          {tenants.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <input name="start_date" type="date" required className={input} />
        <input name="end_date" type="date" className={input} />
        <input name="rent_amount" type="number" min="0" step="0.01" placeholder="Monthly rent" className={input} />
        <input name="deposit" type="number" min="0" step="0.01" placeholder="Deposit" className={input} />
        <select name="status" className={input} defaultValue="active">
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
          <option value="terminated">Terminated</option>
        </select>
        <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          <FilePlus className="h-4 w-4" aria-hidden /> Add lease
        </button>
      </form>

      {properties.length === 0 || tenants.length === 0 ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          You need at least one property and one tenant before creating a lease.
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Term</th>
              <th className="px-4 py-3 font-medium">Rent</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leases.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{l.properties?.title ?? '—'}</td>
                <td className="px-4 py-3 text-slate-700">{l.tenants?.full_name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(l.start_date)} → {l.end_date ? formatDate(l.end_date) : 'open'}
                </td>
                <td className="px-4 py-3 text-slate-700">{formatPrice(l.rent_amount, l.currency, 'rent')}</td>
                <td className="px-4 py-3">
                  <form action={updateLeaseStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={l.id} />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[l.status] ?? ''}`}>
                      {l.status}
                    </span>
                    <select
                      name="status"
                      defaultValue={l.status}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="ended">Ended</option>
                      <option value="terminated">Terminated</option>
                    </select>
                    <button type="submit" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {leases.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">No leases yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
