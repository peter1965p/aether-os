import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * AETHER OS - Unified Proxy/Middleware
 * Schützt Admin, Client und das Select-Terminal
 */
async function sharedHandler(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API & STATIC PASS (Ignorieren für System-Dateien)
  if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. AUTH-CHECK
  // Wir prüfen auf den 'aether_auth_active' Cookie, da dieser HttpOnly ist
  const isAuthenticated = request.cookies.get('aether_auth_active')?.value === 'true';

  // 3. PROTECTED ROUTES LISTE
  // Alles was hier drin steht, erfordert einen Login
  const isProtectedRoute =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/client') ||
      pathname.startsWith('/select');

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Wenn nicht eingeloggt -> HARTER KICKBACK zum Login
      console.log(`[AUTH] Access Denied for ${pathname} - Redirecting to /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. LOGIN-PAGE PROTECTION (Optional)
  // Wenn man bereits eingeloggt ist, sollte man nicht mehr auf /login kommen
  if (pathname === '/login' && isAuthenticated) {
    // Hier entscheiden: Entweder zum Client oder falls Gott-Account, wird das eh durch die Action geregelt.
    // Wir lassen es für den Moment simpel, damit kein Loop entsteht.
  }

  return NextResponse.next();
}

export const middleware = sharedHandler;
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default sharedHandler;