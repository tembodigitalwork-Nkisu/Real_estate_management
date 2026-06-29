import { requireAdmin } from '@/lib/admin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { logout } from './actions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: redirects non-admins before any page renders.
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar email={user.email ?? ''} logoutAction={logout} />
      <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
