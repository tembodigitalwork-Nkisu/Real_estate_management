import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// The object shape Supabase passes to setAll(). Annotated explicitly because
// the union-typed `cookies` option defeats contextual parameter inference.
type CookieToSet = { name: string; value: string; options?: CookieOptions };

// Redirect any protected /admin route to the login page. Used as the safe
// fallback whenever we can't establish an authenticated session.
function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

// Refreshes the Supabase auth session on every request and guards /admin routes.
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isLoginRoute = path === '/admin/login';
  const isProtectedAdmin = isAdminRoute && !isLoginRoute;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, never crash the whole site from middleware.
  // Block the admin area (it cannot work without auth) and let everything else
  // through so public pages and the login screen still render.
  if (!supabaseUrl || !supabaseKey) {
    return isProtectedAdmin ? redirectToLogin(request) : NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    // IMPORTANT: do not run code between createServerClient and getUser().
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Unauthenticated users hitting a protected admin page get sent to login.
    if (isProtectedAdmin && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }

    // Already-authenticated users should skip the login page.
    if (isLoginRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    // Auth backend unreachable or misconfigured. Fail closed on protected admin
    // routes, fail open elsewhere, but never throw a site-wide 500.
    console.error('updateSession: auth check failed:', error);
    return isProtectedAdmin ? redirectToLogin(request) : supabaseResponse;
  }
}
