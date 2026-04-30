import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/db';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignoriere Admin, API und statische Files
  if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.') // Deckt favicon, png etc. ab
  ) {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

  let botType = isBot ? 'BOT' : 'HUMAN';

  // Minimalistisches Logging für die Vercel-Logs
  console.log(`[AETHER_SIGNAL] ${botType} | Path: ${pathname}`);

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

