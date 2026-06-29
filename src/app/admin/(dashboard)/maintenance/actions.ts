'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';

export async function createMaintenance(formData: FormData) {
  const { supabase } = await requireAdmin();
  const property_id = String(formData.get('property_id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  if (!property_id || !title) return;

  await supabase.from('maintenance_requests').insert({
    property_id,
    tenant_id: String(formData.get('tenant_id') ?? '').trim() || null,
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    priority: String(formData.get('priority') ?? 'medium'),
    status: 'open',
  });
  revalidatePath('/admin/maintenance');
}

export async function updateMaintenanceStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (id && status) {
    await supabase.from('maintenance_requests').update({ status }).eq('id', id);
    revalidatePath('/admin/maintenance');
  }
}
