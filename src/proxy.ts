import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // WICHTIG: Der Name muss exakt mit dem in deiner actions.ts übereinstimmen!
  // Wir nehmen 'aether_session_start', da wir den dort setzen.
  const session = request.cookies.get('aether_session_start')?.value;

  console.log("🛡️ PROXY CHECK:", request.nextUrl.pathname, "SESSION:", !!session);

  // Schutz für den Admin-Bereich
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      console.log("🚫 ACCESS DENIED: REDIRECT TO LOGIN");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};