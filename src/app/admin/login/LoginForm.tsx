'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    params.get('error') === 'not_admin'
      ? 'That account is not an administrator.'
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Full navigation so the middleware re-evaluates the new session cookie.
    // Only follow same-origin relative paths — never an attacker-supplied
    // absolute or protocol-relative ("//host") URL — to avoid an open redirect.
    const requested = params.get('redirect');
    const redirectTo =
      requested && requested.startsWith('/') && !requested.startsWith('//')
        ? requested
        : '/admin';
    window.location.assign(redirectTo);
  }

  const field =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Building2 className="h-6 w-6 text-brand-600" aria-hidden />
          <span>Acacia Portal</span>
        </div>
        <h1 className="mt-6 text-xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Administrator access only.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
