import Link from 'next/link';
import { Building2, Users, FileText, Wrench, Inbox, ArrowRight } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import type { Enquiry } from '@/lib/types';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();

  // count: 'exact', head: true returns only the row count, not the rows.
  const [
    published,
    draft,
    tenants,
    activeLeases,
    openMaintenance,
    newEnquiries,
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('tenants').select('*', { count: 'exact', head: true }),
    supabase.from('leases').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]).then((rows) => rows.map((r) => r.count ?? 0));

  const { data: recent } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Published listings', value: published, sub: `${draft} draft`, icon: Building2, href: '/admin/properties' },
    { label: 'Tenants', value: tenants, icon: Users, href: '/admin/tenants' },
    { label: 'Active leases', value: activeLeases, icon: FileText, href: '/admin/leases' },
    { label: 'Open maintenance', value: openMaintenance, icon: Wrench, href: '/admin/maintenance' },
    { label: 'New enquiries', value: newEnquiries, icon: Inbox, href: '/admin/enquiries' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">Overview of your portfolio and activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <s.icon className="h-6 w-6 text-brand-600" aria-hidden />
            <p className="mt-3 text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
            {s.sub && <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-800">
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        {recent && recent.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {(recent as Enquiry[]).map((e) => (
              <li key={e.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-slate-900">{e.name}</p>
                  <p className="line-clamp-1 text-sm text-slate-500">{e.message}</p>
                </div>
                <div className="ml-4 shrink-0 text-right">
                  <p className="text-xs text-slate-400">{formatDate(e.created_at)}</p>
                  {e.property && <p className="text-xs text-slate-500">{e.property}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
