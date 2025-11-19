import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Public paths
  const publicPaths = ['/', '/auth/login', '/auth/register', '/apply'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // API routes are public except auth-required ones
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public paths without authentication
  if (isPublicPath && !pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (token && pathname.startsWith('/dashboard')) {
    const role = token.role as string;
    
    // Check if user is accessing their own dashboard
    if (pathname.startsWith('/dashboard/participant') && role !== 'participant') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    
    if (pathname.startsWith('/dashboard/mentor') && role !== 'mentor') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    
    if (pathname.startsWith('/dashboard/partner') && role !== 'partner') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  // Redirect authenticated users from auth pages
  if (token && pathname.startsWith('/auth')) {
    const role = token.role as string;
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
