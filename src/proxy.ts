import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * AETHER OS - Unified Proxy/Middleware (Next.js 16 compatible)
 */
async function sharedHandler(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API & STATIC PASS
  if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. ADMIN PROTECTION
  const session = request.cookies.get('aether_session_start')?.value;

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Wir exportieren BEIDE Namen, um Turbopack zufriedenzustellen
export const middleware = sharedHandler;
export const proxy = sharedHandler;

// Und zur Sicherheit auch als Default
export default sharedHandler;

export const config = {
  matcher: [
    /*
     * Fängt alles ab, die Logik oben sortiert die API aus.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};