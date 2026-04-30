import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * AETHER OS - Unified Proxy & Traffic Middleware
 * Diese Datei regelt sowohl den Zugriffsschutz als auch das Traffic-Monitoring.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Filter: Interne Next.js Pfade und statische Dateien ignorieren
  if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Sicherheits-Check: Admin-Bereich schützen
  // Wir prüfen den Cookie 'aether_session_start', der in den Auth-Actions gesetzt wird.
  const session = request.cookies.get('aether_session_start')?.value;

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log(`🚫 [AETHER] ACCESS DENIED: ${pathname} -> Redirect to Login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log(`🛡️ [AETHER] ADMIN CHECK: ${pathname} -> Session Active`);
  }

  // 3. Traffic-Analyse: Bot-Erkennung (für nicht-Admin Pfade)
  if (!pathname.startsWith('/admin')) {
    const ua = request.headers.get('user-agent') || '';
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

    // Logging für Telemetrie (Wichtig für AETHER OS Monitoring)
    console.log(`🌐 [AETHER] ${isBot ? 'BOT' : 'USER'} access: ${pathname}`);
  }

  return NextResponse.next();
}

/**
 * Konfiguration des Matchers.
 * Wir fangen fast alles ab, außer API-Routen und statische Assets,
 * um die Logik innerhalb der Funktion zentral zu steuern.
 */
export const config = {
  matcher: [
    /*
     * Matcht alle Pfade außer:
     * - api (API Routen)
     * - _next/static (Statische Dateien)
     * - _next/image (Bildoptimierung)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};