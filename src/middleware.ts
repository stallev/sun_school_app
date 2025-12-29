/**
 * Next.js Middleware for route protection
 * Protects private routes and admin routes based on JWT token and user roles
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Decode JWT token to get user information
 * For MVP, we decode without signature verification
 * In production, you might want to verify the token signature
 */
function decodeJWT(token: string): { sub?: string; email?: string; 'cognito:groups'?: string[] } | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.sub) {
      return true;
    }

    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    if ('exp' in payload && typeof payload.exp === 'number') {
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    }

    // If no expiration, consider it valid (for MVP)
    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

/**
 * Middleware function to protect routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get('cognito-id-token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/api'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Protected routes (require authentication)
  const protectedRoutes = ['/grades', '/lessons', '/homework-check', '/pupil-personal-data', '/grade-leaderboard', '/golden-verses-library'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Admin routes (require ADMIN or SUPERADMIN role)
  const adminRoutes = ['/grades-list', '/teachers-management', '/pupils-management', '/families-management', '/school-process-management'];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Static files and Next.js internals - allow without authentication
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute) {
    // If user is already authenticated and tries to access /auth, redirect based on role
    if (pathname.startsWith('/auth') && idToken && !isTokenExpired(idToken)) {
      const decoded = decodeJWT(idToken);
      const groups = decoded?.['cognito:groups'] || [];
      const userRole = groups[0] || 'TEACHER';

      if (userRole === 'TEACHER') {
        return NextResponse.redirect(new URL('/grades/my', request.url));
      } else if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
        return NextResponse.redirect(new URL('/grades-list', request.url));
      }
    }

    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute || isAdminRoute) {
    // Check if user is authenticated
    if (!idToken || isTokenExpired(idToken)) {
      // Redirect to login page
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode token to get user groups
    const decoded = decodeJWT(idToken);
    if (!decoded) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/auth', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const groups = decoded['cognito:groups'] || [];
    const userRole = groups[0] || 'TEACHER';

    // Check admin routes access
    if (isAdminRoute) {
      if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
        // Teacher trying to access admin route, redirect to their home
        return NextResponse.redirect(new URL('/grades/my', request.url));
      }
    }

    // Allow access to protected routes
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Matches all routes except static files and API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$).*)',
  ],
};

