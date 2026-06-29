'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';

export async function updateEnquiryStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (id && status) {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    revalidatePath('/admin/enquiries');
  }
}
