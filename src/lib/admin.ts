import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Ensures the current request is an authenticated admin.
// Returns the Supabase client and user; redirects to login otherwise.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  // Authenticated but not provisioned as an admin.
  if (!adminRow) redirect('/admin/login?error=not_admin');

  return { supabase, user };
}
