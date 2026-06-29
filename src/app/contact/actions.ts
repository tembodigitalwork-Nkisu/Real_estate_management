'use server';

import { createClient } from '@/lib/supabase/server';

export interface ContactState {
  ok: boolean;
  error?: string;
}

// Server Action: validates and stores a lead. RLS allows anonymous inserts
// into public.enquiries, so no service-role key is needed here.
export async function submitEnquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const property = String(formData.get('property') ?? '').trim();

  if (!name || !message) {
    return { ok: false, error: 'Please provide your name and a message.' };
  }
  if (!email && !phone) {
    return { ok: false, error: 'Please provide an email or phone number so we can reply.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('enquiries').insert({
    name,
    email: email || null,
    phone: phone || null,
    message,
    property: property || null,
  });

  if (error) {
    console.error('submitEnquiry failed:', error.message);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return { ok: true };
}
