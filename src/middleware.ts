import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /work and its subpaths
  if (!pathname.startsWith('/work')) {
    return NextResponse.next();
  }

  // Allow the login page and API route
  if (pathname === '/work/login' || pathname === '/api/work-auth') {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('work-auth')?.value;
  const secret = process.env.WORK_AUTH_SECRET || 'clea-work-secret-2025';

  if (authCookie !== secret) {
    const loginUrl = new URL('/work/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/work/:path*', '/api/work-auth'],
};
