'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';

export async function createTenant(formData: FormData) {
  const { supabase } = await requireAdmin();
  const full_name = String(formData.get('full_name') ?? '').trim();
  if (!full_name) return;

  await supabase.from('tenants').insert({
    full_name,
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    national_id: String(formData.get('national_id') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
  });
  revalidatePath('/admin/tenants');
}

export async function deleteTenant(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await supabase.from('tenants').delete().eq('id', id);
    revalidatePath('/admin/tenants');
  }
}
