import { Wrench } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import type { Property, Tenant } from '@/lib/types';
import { createMaintenance, updateMaintenanceStatus } from './actions';

export const metadata = { title: 'Maintenance' };

interface MaintRow {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  created_at: string;
  properties: { title: string } | null;
  tenants: { full_name: string } | null;
}

const input = 'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800';
const priorityStyles: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
};
const statusStyles: Record<string, string> = {
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-200 text-slate-600',
};

export default async function MaintenancePage() {
  const { supabase } = await requireAdmin();

  const [reqRes, propsRes, tenantsRes] = await Promise.all([
    supabase
      .from('maintenance_requests')
      .select('id,title,description,priority,status,created_at,properties(title),tenants(full_name)')
      .order('created_at', { ascending: false }),
    supabase.from('properties').select('id,title').order('title'),
    supabase.from('tenants').select('id,full_name').order('full_name'),
  ]);

  const requests = (reqRes.data ?? []) as unknown as MaintRow[];
  const properties = (propsRes.data ?? []) as Pick<Property, 'id' | 'title'>[];
  const tenants = (tenantsRes.data ?? []) as Pick<Tenant, 'id' | 'full_name'>[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Maintenance</h1>
      <p className="mt-1 text-slate-500">{requests.length} request(s)</p>

      <form action={createMaintenance} className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:grid-cols-4">
        <select name="property_id" required className={input} defaultValue="">
          <option value="" disabled>Property…</option>
          {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select name="tenant_id" className={input} defaultValue="">
          <option value="">Tenant (optional)</option>
          {tenants.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <input name="title" required placeholder="Issue title" className={input} />
        <select name="priority" className={input} defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input name="description" placeholder="Description (optional)" className={`${input} lg:col-span-3`} />
        <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          <Wrench className="h-4 w-4" aria-hidden /> Log request
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{r.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityStyles[r.priority] ?? ''}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {r.properties?.title ?? '—'}
                  {r.tenants?.full_name ? ` · ${r.tenants.full_name}` : ''}
                  {' · '}{formatDate(r.created_at)}
                </p>
                {r.description && <p className="mt-2 text-sm text-slate-600">{r.description}</p>}
              </div>
              <form action={updateMaintenanceStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={r.id} />
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[r.status] ?? ''}`}>
                  {r.status.replace('_', ' ')}
                </span>
                <select name="status" defaultValue={r.status} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                  Update
                </button>
              </form>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No maintenance requests logged.
          </p>
        )}
      </div>
    </div>
  );
}
