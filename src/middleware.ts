import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/db';

export function middleware(request: NextRequest) {
  // Ignoriere interne Next.js-Pfade und statische Dateien
  if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

  // WICHTIG: Kein Datenbank-Import hier! 
  // Nutze stattdessen nur Logs für Vercel oder externe API-Calls.
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    console.log(`[AETHER] ${isBot ? 'BOT' : 'USER'} access: ${request.nextUrl.pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

