'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';

export async function createLease(formData: FormData) {
  const { supabase } = await requireAdmin();
  const property_id = String(formData.get('property_id') ?? '');
  const tenant_id = String(formData.get('tenant_id') ?? '');
  const start_date = String(formData.get('start_date') ?? '');
  if (!property_id || !tenant_id || !start_date) return;

  const num = (k: string) => {
    const n = Number(String(formData.get(k) ?? '').trim());
    return Number.isFinite(n) ? n : 0;
  };

  await supabase.from('leases').insert({
    property_id,
    tenant_id,
    start_date,
    end_date: String(formData.get('end_date') ?? '').trim() || null,
    rent_amount: num('rent_amount'),
    deposit: num('deposit'),
    currency: String(formData.get('currency') ?? 'ZMW').trim() || 'ZMW',
    status: String(formData.get('status') ?? 'active'),
  });
  revalidatePath('/admin/leases');
}

export async function updateLeaseStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (id && status) {
    await supabase.from('leases').update({ status }).eq('id', id);
    revalidatePath('/admin/leases');
  }
}
