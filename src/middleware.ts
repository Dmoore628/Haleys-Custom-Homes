import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, sessionSecret, verifySession } from '@/lib/auth/session';

/**
 * Guards the admin. Every /admin page except sign-in, and every /api/admin route, needs a valid,
 * unexpired session signature; anything else is sent to sign-in (pages) or refused (API).
 * The server re-checks the session on every action as well; this is the first line.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret());

  let response: NextResponse;
  if (session || isLogin) {
    response = NextResponse.next();
  } else if (pathname.startsWith('/api/')) {
    response = NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  } else {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname)}`;
    response = NextResponse.redirect(url);
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'same-origin');
  return response;
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
