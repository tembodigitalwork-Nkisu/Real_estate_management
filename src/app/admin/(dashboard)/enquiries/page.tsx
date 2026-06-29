import { Mail, Phone } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import type { Enquiry } from '@/lib/types';
import { updateEnquiryStatus } from './actions';

export const metadata = { title: 'Enquiries' };

const statusStyles: Record<string, string> = {
  new: 'bg-brand-100 text-brand-700',
  contacted: 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-200 text-slate-600',
};

export default async function EnquiriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  const enquiries = (data ?? []) as Enquiry[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
      <p className="mt-1 text-slate-500">{enquiries.length} lead(s)</p>

      <div className="mt-6 space-y-3">
        {enquiries.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{e.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[e.status] ?? ''}`}>
                    {e.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
                  {e.email && (
                    <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-brand-700">
                      <Mail className="h-4 w-4" aria-hidden /> {e.email}
                    </a>
                  )}
                  {e.phone && (
                    <a href={`tel:${e.phone}`} className="flex items-center gap-1 hover:text-brand-700">
                      <Phone className="h-4 w-4" aria-hidden /> {e.phone}
                    </a>
                  )}
                  <span>{formatDate(e.created_at)}</span>
                </div>
                {e.property && (
                  <p className="mt-2 text-sm">
                    <span className="text-slate-500">Re:</span>{' '}
                    <span className="font-medium text-slate-700">{e.property}</span>
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-700">{e.message}</p>
              </div>

              <form action={updateEnquiryStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={e.id} />
                <select name="status" defaultValue={e.status} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="submit" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                  Update
                </button>
              </form>
            </div>
          </div>
        ))}
        {enquiries.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No enquiries yet. Submissions from the public contact form appear here.
          </p>
        )}
      </div>
    </div>
  );
}
