import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/db';

export async function middleware(request: NextRequest) {
  // Wir ignorieren Admin-Interaktionen und statische Dateien
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);
  
  // Identifiziere bekannte Bots
  let botName = null;
  if (isBot) {
    if (ua.includes('Googlebot')) botName = 'Google_Crawler';
    else if (ua.includes('GPTBot')) botName = 'ChatGPT_Agent';
    else if (ua.includes('bingbot')) botName = 'Bing_Search';
    else botName = 'Unknown_Bot';
  }

  // Hier würden wir das Signal an die DB senden
  // Hinweis: In einer echten Middleware nutzen wir oft einen schnellen Edge-Ping
  console.log(`AETHER_SIGNAL: ${isBot ? 'BOT' : 'HUMAN'} | ${botName || 'User'} | Path: ${request.nextUrl.pathname}`);

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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};