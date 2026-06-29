'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wrench,
  Inbox,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/tenants', label: 'Tenants', icon: Users },
  { href: '/admin/leases', label: 'Leases', icon: FileText },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
];

export function AdminSidebar({
  email,
  logoutAction,
}: {
  email: string;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5 font-semibold text-slate-900">
        <Building2 className="h-6 w-6 text-brand-600" aria-hidden />
        <span>Acacia Portal</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-800"
        >
          <ExternalLink className="h-4 w-4" aria-hidden /> View public site
        </Link>
        <p className="truncate px-3 py-2 text-xs text-slate-400" title={email}>
          {email}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
